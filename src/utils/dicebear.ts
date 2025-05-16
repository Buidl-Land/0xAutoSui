export const DICEBEAR_STYLES = {
  AGENT: 'bottts',
  AGENT_ALT: 'pixel-art-neutral',
  MCP: 'bottts-neutral',
  USER: 'micah',
  USER_ALT: 'personas',
  GENERIC: 'identicon', // Fallback
} as const;

export type DiceBearStyle = typeof DICEBEAR_STYLES[keyof typeof DICEBEAR_STYLES];

/**
 * Generates a DiceBear avatar URL.
 * @param style - The DiceBear style to use.
 * @param seed - The seed for generating the avatar (e.g., username, agent name).
 * @param options - Additional DiceBear options (e.g., { backgroundColor: ['transparent'] }).
 * @returns The full DiceBear avatar URL.
 */
export const getDiceBearAvatar = (
  style: DiceBearStyle,
  seed: string,
  options?: Record<string, any>
): string => {
  const baseUrl = 'https://api.dicebear.com/7.x';
  const queryParams = new URLSearchParams();
  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'backgroundColor' && Array.isArray(value)) {
        // For backgroundColor array, remove # from hex codes
        const processedColors = value.map(color =>
          typeof color === 'string' && color.startsWith('#') ? color.substring(1) : color
        );
        queryParams.append(key, processedColors.join(','));
      } else if (Array.isArray(value)) {
        queryParams.append(key, value.join(','));
      } else {
        queryParams.append(key, String(value));
      }
    });
  }
  // Ensure seed is URL encoded
  const encodedSeed = encodeURIComponent(seed);
  let url = `${baseUrl}/${style}/svg?seed=${encodedSeed}`;
  const paramsString = queryParams.toString();
  if (paramsString) {
    url += `&${paramsString}`;
  }
  return url;
};