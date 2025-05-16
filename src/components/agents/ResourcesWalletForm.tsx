"use client";

import React from 'react';

// Mock wallet type, replace with actual type from your /types later
interface Wallet {
  id: string;
  name: string;
}

interface ResourcesWalletFormProps {
  associatedWalletId: string | null | undefined;
  autoRefillServiceCredits: boolean | undefined;
  serviceCreditsRefillThreshold: number | undefined;
  serviceCreditsRefillAmount: number | undefined;
  autoRefillSol: boolean | undefined;
  solRefillThreshold: number | undefined;
  solRefillAmount: number | undefined;
  solRefillSourceEoa: string | undefined;
  availableWallets: Wallet[]; // Mock data for now
  onInputChange: (name: string, value: string | number | boolean) => void;
}

const ResourcesWalletForm: React.FC<ResourcesWalletFormProps> = ({
  associatedWalletId,
  autoRefillServiceCredits,
  serviceCreditsRefillThreshold,
  serviceCreditsRefillAmount,
  autoRefillSol,
  solRefillThreshold,
  solRefillAmount,
  solRefillSourceEoa,
  availableWallets,
  onInputChange,
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.name, e.target.checked);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    onInputChange(e.target.name, value);
  };


  return (
    <div className="mb-8 p-6 bg-base-100 rounded-lg shadow">
      <h3 className="text-xl font-medium mb-4">Resources & Wallet</h3>

      <div className="form-control mb-4">
        <label className="label" htmlFor="associatedWalletId">
          <span className="label-text text-base">Associated Abstract Wallet</span>
        </label>
        <select
          id="associatedWalletId"
          name="associatedWalletId"
          className="select select-bordered w-full"
          value={associatedWalletId || ""}
          onChange={handleValueChange}
        >
          <option value="none">No Wallet Required</option>
          <option value="" disabled>Select a wallet</option>
          {availableWallets.map(wallet => (
            <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
          ))}
          <option value="new">Create New Wallet</option>
        </select>
      </div>

      {associatedWalletId && associatedWalletId !== "none" && (
        <>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-base">Estimated Consumption</span>
            </label>
            <p className="text-sm p-2 bg-base-200 rounded-md">
              SOL Gas: (Mocked) 0.005 SOL / run <br />
              Service Credits: (Mocked) 10 credits / run
            </p>
          </div>

          <div className="form-control mb-2">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                name="autoRefillServiceCredits"
                className="checkbox checkbox-primary"
                checked={!!autoRefillServiceCredits}
                onChange={handleCheckboxChange}
              />
              <span className="label-text text-base">Auto-refill Service Credits</span>
            </label>
            <p className="text-xs text-base-content/70 ml-8">If wallet USDT balance is sufficient and service credits are below threshold.</p>
          </div>
          {autoRefillServiceCredits && (
            <div className="pl-8 space-y-2 mb-4">
              <div className="form-control">
                <label className="label" htmlFor="serviceCreditsRefillThreshold">
                  <span className="label-text text-sm">Refill Threshold (Credits)</span>
                </label>
                <input
                  id="serviceCreditsRefillThreshold"
                  name="serviceCreditsRefillThreshold"
                  type="number"
                  placeholder="e.g., 50"
                  className="input input-sm input-bordered w-full"
                  value={serviceCreditsRefillThreshold || ""}
                  onChange={handleValueChange}
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="serviceCreditsRefillAmount">
                  <span className="label-text text-sm">Refill Amount (Credits)</span>
                </label>
                <input
                  id="serviceCreditsRefillAmount"
                  name="serviceCreditsRefillAmount"
                  type="number"
                  placeholder="e.g., 200"
                  className="input input-sm input-bordered w-full"
                  value={serviceCreditsRefillAmount || ""}
                  onChange={handleValueChange}
                />
              </div>
            </div>
          )}

          <div className="form-control mb-2">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                name="autoRefillSol"
                className="checkbox checkbox-primary"
                checked={!!autoRefillSol}
                onChange={handleCheckboxChange}
              />
              <span className="label-text text-base">Auto-refill SOL</span>
            </label>
             <p className="text-xs text-base-content/70 ml-8">If wallet SOL balance is below Gas threshold, transfer from linked EOA.</p>
          </div>
          {autoRefillSol && (
             <div className="pl-8 space-y-2">
              <div className="form-control">
                <label className="label" htmlFor="solRefillThreshold">
                  <span className="label-text text-sm">Refill Threshold (SOL)</span>
                </label>
                <input
                  id="solRefillThreshold"
                  name="solRefillThreshold"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 0.1"
                  className="input input-sm input-bordered w-full"
                  value={solRefillThreshold || ""}
                  onChange={handleValueChange}
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="solRefillAmount">
                  <span className="label-text text-sm">Refill Amount (SOL)</span>
                </label>
                <input
                  id="solRefillAmount"
                  name="solRefillAmount"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 0.5"
                  className="input input-sm input-bordered w-full"
                  value={solRefillAmount || ""}
                  onChange={handleValueChange}
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="solRefillSourceEoa">
                  <span className="label-text text-sm">Source EOA Address</span>
                </label>
                <input
                  id="solRefillSourceEoa"
                  name="solRefillSourceEoa"
                  type="text"
                  placeholder="Enter EOA address"
                  className="input input-sm input-bordered w-full"
                  value={solRefillSourceEoa || ""}
                  onChange={handleValueChange}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResourcesWalletForm;