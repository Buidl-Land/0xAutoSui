import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness, getExtendedEphemeralPublicKey } from '@mysten/sui/zklogin';
import { jwtToAddress } from '@mysten/sui/zklogin';
import { jwtDecode } from 'jwt-decode';
import { SuiClient } from '@mysten/sui/client';

// Types
export interface ZkLoginState {
  provider: 'Google';
  nonce: string;
  randomness: string;
  ephemeralKeyPair: Ed25519Keypair;
  ephemeralPublicKey: string;
  maxEpoch: number;
  currentEpoch: number;
}

export interface ZkLoginSession {
  userAddress: string;
  jwt: string;
  sub: string;
  aud: string;
  userSalt: string;
  ephemeralKeyPair?: Ed25519Keypair;
}

// Constants
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || 
  (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'http://localhost:3000/auth/callback');
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

// Storage keys
const STORAGE_KEYS = {
  ZKLOGIN_STATE: 'zklogin_state',
  ZKLOGIN_SESSION: 'zklogin_session',
};

// Initialize Sui client
const suiClient = new SuiClient({
  url: 'https://fullnode.mainnet.sui.io',
});

// Generate ephemeral key pair
export function generateEphemeralKeyPair(): Ed25519Keypair {
  return new Ed25519Keypair();
}

// Setup zkLogin state
export async function setupZkLoginState(): Promise<ZkLoginState> {
  console.log('Setting up zkLogin state...');
  
  // Get current epoch from Sui
  const { epoch } = await suiClient.getLatestSuiSystemState();
  const currentEpoch = Number(epoch);
  const maxEpoch = currentEpoch + 2; // Valid for 2 epochs

  // Generate ephemeral key pair
  const ephemeralKeyPair = generateEphemeralKeyPair();
  const ephemeralPublicKey = getExtendedEphemeralPublicKey(ephemeralKeyPair.getPublicKey());
  
  // Generate randomness and nonce
  const randomness = generateRandomness();
  const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);

  const state: ZkLoginState = {
    provider: 'Google',
    nonce,
    randomness,
    ephemeralKeyPair,
    ephemeralPublicKey,
    maxEpoch,
    currentEpoch,
  };

  // Store state in localStorage (not sessionStorage to persist across redirects)
  const stateToStore = {
    ...state,
    ephemeralKeyPair: Array.from(ephemeralKeyPair.getSecretKey()), // Convert to array for JSON serialization
  };
  
  console.log('Storing zkLogin state:', { nonce, maxEpoch, currentEpoch });
  localStorage.setItem(STORAGE_KEYS.ZKLOGIN_STATE, JSON.stringify(stateToStore));
  
  // Verify storage
  const stored = localStorage.getItem(STORAGE_KEYS.ZKLOGIN_STATE);
  console.log('Verified storage:', stored ? 'Success' : 'Failed');

  return state;
}

// Get stored zkLogin state
export function getStoredZkLoginState(): ZkLoginState | null {
  console.log('Getting stored zkLogin state...');
  console.log('Available localStorage keys:', Object.keys(localStorage));
  
  const stored = localStorage.getItem(STORAGE_KEYS.ZKLOGIN_STATE);
  console.log('Raw stored data:', stored);
  
  if (!stored) {
    console.log('No stored zkLogin state found');
    return null;
  }

  try {
    const parsed = JSON.parse(stored);
    console.log('Parsed stored data:', { 
      hasNonce: !!parsed.nonce, 
      hasEphemeralKeyPair: !!parsed.ephemeralKeyPair,
      maxEpoch: parsed.maxEpoch 
    });
    
    // Recreate keypair from stored secret key
    const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(new Uint8Array(parsed.ephemeralKeyPair));
    
    const state = {
      ...parsed,
      ephemeralKeyPair,
    };
    
    console.log('Successfully reconstructed zkLogin state');
    return state;
  } catch (error) {
    console.error('Failed to parse stored zkLogin state:', error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEYS.ZKLOGIN_STATE);
    return null;
  }
}

// Build Google OAuth URL
export function buildGoogleAuthUrl(nonce: string): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'id_token',
    scope: 'openid email profile',
    nonce: nonce,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// Start Google login flow
export async function startGoogleLogin(): Promise<void> {
  if (!CLIENT_ID) {
    throw new Error('Google Client ID not configured. Please check your .env.local file.');
  }

  const state = await setupZkLoginState();
  const authUrl = buildGoogleAuthUrl(state.nonce);
  
  // Redirect to Google OAuth
  window.location.href = authUrl;
}

// Handle OAuth callback
export async function handleOAuthCallback(hashParams: URLSearchParams): Promise<ZkLoginSession> {
  console.log('=== Starting OAuth callback handling ===');
  console.log('Hash params:', Array.from(hashParams.entries()));
  
  const idToken = hashParams.get('id_token');
  if (!idToken) {
    console.error('No ID token found in hash params');
    throw new Error('No ID token found in callback');
  }
  
  console.log('ID token found, length:', idToken.length);

  // Get stored state
  console.log('Attempting to get stored zkLogin state...');
  const state = getStoredZkLoginState();
  if (!state) {
    console.error('=== CRITICAL: No zkLogin state found ===');
    console.log('This usually means:');
    console.log('1. User refreshed the page during OAuth flow');
    console.log('2. localStorage was cleared');
    console.log('3. State was not properly saved');
    console.log('Available localStorage keys:', Object.keys(localStorage));
    
    // Try to create a minimal session without the stored state
    console.log('Attempting to create session without stored state...');
    try {
      const decodedJwt = jwtDecode<{ sub: string; aud: string; email?: string }>(idToken);
      const userSalt = generateUserSalt(decodedJwt.sub);
      const userAddress = jwtToAddress(idToken, userSalt);
      
      const session: ZkLoginSession = {
        userAddress,
        jwt: idToken,
        sub: decodedJwt.sub,
        aud: decodedJwt.aud as string,
        userSalt,
        // No ephemeralKeyPair since we don't have the stored state
      };

      localStorage.setItem(STORAGE_KEYS.ZKLOGIN_SESSION, JSON.stringify(session));
      console.log('Created session without ephemeral key pair:', session);
      return session;
    } catch (fallbackError) {
      console.error('Fallback session creation failed:', fallbackError);
      throw new Error('No zkLogin state found. Please try logging in again.');
    }
  }

  try {
    console.log('Processing JWT with stored state...');
    
    // Decode JWT to get claims
    const decodedJwt = jwtDecode<{ sub: string; aud: string; email?: string }>(idToken);
    console.log('Decoded JWT:', { sub: decodedJwt.sub, aud: decodedJwt.aud, email: decodedJwt.email });
    
    // Generate a deterministic user salt based on sub (or use a fixed salt)
    // In production, you might want to store this per user
    const userSalt = generateUserSalt(decodedJwt.sub);
    console.log('Generated user salt:', userSalt);
    
    // Calculate zkLogin address
    const userAddress = jwtToAddress(idToken, userSalt);
    console.log('Generated user address:', userAddress);

    const session: ZkLoginSession = {
      userAddress,
      jwt: idToken,
      sub: decodedJwt.sub,
      aud: decodedJwt.aud as string,
      userSalt,
      ephemeralKeyPair: state.ephemeralKeyPair,
    };

    // Store session
    localStorage.setItem(STORAGE_KEYS.ZKLOGIN_SESSION, JSON.stringify({
      ...session,
      ephemeralKeyPair: undefined, // Don't store keypair in localStorage for this demo
    }));

    // Clean up the temporary state
    localStorage.removeItem(STORAGE_KEYS.ZKLOGIN_STATE);
    console.log('=== OAuth callback completed successfully ===');

    return session;
  } catch (error) {
    console.error('Error processing OAuth callback:', error);
    throw new Error(`Failed to process login: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Generate user salt (deterministic based on sub)
function generateUserSalt(sub: string): string {
  // In a real app, you might want to use a more sophisticated approach
  // or store user salts in a database
  return BigInt(`0x${Buffer.from(sub).toString('hex').slice(0, 32).padEnd(32, '0')}`).toString();
}

// Get current session
export function getCurrentSession(): ZkLoginSession | null {
  const stored = localStorage.getItem(STORAGE_KEYS.ZKLOGIN_SESSION);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse stored session:', error);
    return null;
  }
}

// Clear session
export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.ZKLOGIN_SESSION);
  localStorage.removeItem(STORAGE_KEYS.ZKLOGIN_STATE);
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  return getCurrentSession() !== null;
}

// Test function to verify localStorage is working
export function testLocalStorage(): void {
  console.log('=== Testing localStorage ===');
  try {
    const testKey = 'zklogin_test';
    const testValue = { test: 'data', timestamp: Date.now() };
    
    // Test write
    localStorage.setItem(testKey, JSON.stringify(testValue));
    console.log('✓ localStorage write successful');
    
    // Test read
    const retrieved = localStorage.getItem(testKey);
    if (retrieved) {
      const parsed = JSON.parse(retrieved);
      console.log('✓ localStorage read successful:', parsed);
    } else {
      console.error('✗ localStorage read failed');
    }
    
    // Cleanup
    localStorage.removeItem(testKey);
    console.log('✓ localStorage cleanup successful');
    
    console.log('=== localStorage test completed ===');
  } catch (error) {
    console.error('✗ localStorage test failed:', error);
  }
} 