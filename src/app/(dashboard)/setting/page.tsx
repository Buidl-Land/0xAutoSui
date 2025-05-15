"use client";

import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { PencilSquareIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { User } from '@/types/user'; // Import the User type
import { fetchMockCurrentUser } from '@/data/mocks/userMocks'; // Import the new mock function
import { getDiceBearAvatar, DICEBEAR_STYLES } from '@/utils/dicebear'; // Import DiceBear utility

const SettingPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formState, setFormState] = useState<{ name: string; avatarUrl: string | null }>({
    name: '',
    avatarUrl: null,
  });
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // State for Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await fetchMockCurrentUser(); // Use the new mock function
      setCurrentUser(userData);
      if (userData) { // Check if userData is not null
        setFormState({
          name: userData.username,
          avatarUrl: userData.avatarUrl || null,
        });
        setAvatarPreview(userData.avatarUrl || null);
      }
    };
    loadUser();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedAvatarFile(null);
      setAvatarPreview(currentUser?.avatarUrl || null);
    }
  };

  const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Saving Profile - Form State:", formState);
    const profileDataToSave = {
      username: formState.name,
      avatarUrl: formState.avatarUrl,
    };
    console.log("Profile data to save to backend:", profileDataToSave);

    if (selectedAvatarFile) {
      console.log("Avatar to upload:", selectedAvatarFile.name);
      // Mock upload logic:
      // const uploadedAvatarUrl = `/path/to/uploaded/${selectedAvatarFile.name}`;
      // Update currentUser state correctly:
      // setCurrentUser(prev => prev ? {...prev, username: profileDataToSave.username, avatarUrl: uploadedAvatarUrl} : null);
      // setFormState(prev => ({...prev, avatarUrl: uploadedAvatarUrl})); // Update formState if needed
    } else {
       // setCurrentUser(prev => prev ? {...prev, username: profileDataToSave.username} : null);
    }
    // In a real app, call API to update user:
    // apiToUpdateUser(profileDataToSave);
    alert("Profile saved (mock)!");
  };

  // Delete Modal Handlers
  const handleOpenDeleteModal = () => {
    deleteModalRef.current?.showModal();
  };
  const handleCloseDeleteModal = () => {
    deleteModalRef.current?.close();
  };
  const handleConfirmDelete = () => {
    console.log("Mock Delete Account: Account deletion initiated.");
    handleCloseDeleteModal();
  };

  if (!currentUser) {
    return <div className="p-4">Loading user data...</div>; // Or a proper loading spinner
  }

  // Determine the avatar source, falling back to DiceBear
  const finalAvatarSrc = avatarPreview ||
                       (currentUser?.avatarUrl && currentUser.avatarUrl !== '/default-avatar.svg' ? currentUser.avatarUrl : null) || // Prefer uploaded avatar if not default
                       getDiceBearAvatar(DICEBEAR_STYLES.USER, currentUser.username || 'default-user-settings', { backgroundColor: ['transparent', 'primary'] });

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-br from-primary via-accent to-secondary">
        User Settings
      </h1>

      {/* Profile Information Section */}
      <section className="mb-10 p-6 card bg-base-100 shadow-xl">
        <form onSubmit={handleSaveProfile}>
          <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
            Profile Information
          </h2>

          {/* Avatar Upload */}
          <div className="form-control mb-6">
            <label className="label" htmlFor="user-avatar-upload">
              <span className="label-text text-base">Profile Picture</span>
            </label>
            <div className="flex items-center gap-4">
              <label htmlFor="user-avatar-upload" className="cursor-pointer group">
                <div className="relative w-28 h-28 rounded-full border-2 border-dashed border-base-content/30 group-hover:border-primary flex items-center justify-center overflow-hidden bg-base-200">
                  {finalAvatarSrc ? (
                    <img src={finalAvatarSrc} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ArrowUpTrayIcon className="h-12 w-12 text-base-content/40 group-hover:text-primary" />
                  )}
                </div>
              </label>
              <input id="user-avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              {avatarPreview && avatarPreview !== (currentUser.avatarUrl || null) && (
                 <button
                    type="button"
                    className="btn btn-xs btn-ghost text-error"
                    onClick={() => {
                        setSelectedAvatarFile(null);
                        setAvatarPreview(currentUser.avatarUrl || null);
                        const fileInput = document.getElementById('user-avatar-upload') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                    }}
                 >
                   Cancel Change
                 </button>
              )}
            </div>
          </div>

          {/* Username Input */}
          <div className="form-control mb-6">
            <label className="label" htmlFor="user-name-input">
              <span className="label-text text-base">Username</span>
            </label>
            <input
              id="user-name-input"
              name="name"
              type="text"
              className="input input-bordered w-full max-w-md"
              value={formState.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Save Profile</button>
        </form>
      </section>

      {/* Billing Section - Kept as is from original, can be refactored if needed */}
      <section className="mb-10 p-6 card bg-base-100 shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
          Billing
        </h2>
        <div className="flex items-center mb-4 gap-4 flex-wrap">
           <p>Current Points: <span className="font-bold">{currentUser.userId === "user-mock-123" ? 8916 : 0}</span></p> {/* Mock points updated, changed currentUser.id to currentUser.userId */}
           <button className="btn btn-primary btn-sm" onClick={() => console.log('Mock Recharge Clicked')}>Recharge</button>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4">
            <span className="label-text text-base">Enable Auto-Recharge</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              onChange={(e) => console.log(`Mock Auto-Recharge Toggled: ${e.target.checked}`)}
            />
          </label>
        </div>
      </section>

      {/* Account Management Section - Kept as is */}
      <section className="p-6 card bg-base-100 shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
          Account Management
        </h2>
        <button className="btn btn-error w-full max-w-md" onClick={handleOpenDeleteModal}>Delete Account</button>
      </section>

     {/* Delete Account Confirmation Modal */}
     <dialog id="delete_account_modal" className="modal" ref={deleteModalRef}>
       <div className="modal-box">
         <h3 className="font-bold text-lg text-error">Confirm Account Deletion</h3>
         <p className="py-4">Are you sure you want to permanently delete your account? This action cannot be undone.</p>
         <div className="modal-action">
           <button type="button" className="btn btn-ghost" onClick={handleCloseDeleteModal}>Cancel</button>
           <button type="button" className="btn btn-error" onClick={handleConfirmDelete}>Delete Account</button>
         </div>
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleCloseDeleteModal} aria-label="Close delete confirmation modal">
           <XMarkIcon className="h-5 w-5"/>
         </button>
       </div>
        <form method="dialog" className="modal-backdrop"><button type="button" onClick={handleCloseDeleteModal}>close</button></form>
     </dialog>
   </div>
  );
};

export default SettingPage;