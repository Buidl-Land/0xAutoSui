import React, { useState, ChangeEvent, useEffect } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { ExtendedAgent } from '@/data/mockAgents'; // Assuming this type is suitable
import { getDiceBearAvatar, DICEBEAR_STYLES } from '@/utils/dicebear'; // Import DiceBear utility

interface AgentBasicInfoStepProps {
  initialData: Partial<ExtendedAgent>;
  onNext: (data: { name: string; description: string; iconUrl?: string | null; systemPrompt?: string }) => void;
  onBack: () => void;
  creationMethod: string | null;
}

const AgentBasicInfoStep: React.FC<AgentBasicInfoStepProps> = ({ initialData, onNext, onBack, creationMethod }) => {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [iconPreview, setIconPreview] = useState<string | null>(initialData.iconUrl || null);
  const [selectedIconFile, setSelectedIconFile] = useState<File | null>(null);
  // System prompt is often generated or set in a later, more advanced step,
  // but could be part of basic info if the agent type is simple or prompt-driven from the start.
  // For now, let's assume it might be set if coming from a 'prompt' creation method.
  const [systemPrompt, setSystemPrompt] = useState(initialData.systemPrompt || '');

  useEffect(() => {
    setName(initialData.name || '');
    setDescription(initialData.description || '');
    setIconPreview(initialData.iconUrl || null);
    setSystemPrompt(initialData.systemPrompt || '');
  }, [initialData]);

  const handleIconChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedIconFile(null);
      setIconPreview(initialData.iconUrl || null);
    }
  };

  const handleSubmit = () => {
    if (!name || !description) {
      alert('Agent Name and Description are required.');
      return;
    }
    // In a real app, selectedIconFile would be uploaded here and iconUrl set to the returned URL.
    // For mock, we just pass the preview or initial URL.
    onNext({ name, description, iconUrl: iconPreview, systemPrompt });
  };

  return (
    <div className="p-6 card bg-base-100 shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Step 2: Basic Information <span className="text-sm font-normal text-base-content/70">({creationMethod} method)</span>
      </h2>

      <div className="space-y-6">
        {/* Agent Name */}
        <div className="form-control">
          <label className="label" htmlFor="agent-name">
            <span className="label-text text-base">Agent Name</span>
          </label>
          <input
            id="agent-name"
            type="text"
            placeholder="e.g., Solana News Aggregator"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Agent Description */}
        <div className="form-control">
          <label className="label" htmlFor="agent-description">
            <span className="label-text text-base">Description</span>
          </label>
          <textarea
            id="agent-description"
            className="textarea textarea-bordered w-full"
            placeholder="Describe what your agent does..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Agent Icon Upload */}
        <div className="form-control">
            <label className="label">
              <span className="label-text text-base">Agent Icon (Optional)</span>
            </label>
            <div className="flex items-center gap-4">
              <label htmlFor="agent-icon-upload" className="cursor-pointer group">
                <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-base-content/30 group-hover:border-primary flex items-center justify-center overflow-hidden bg-base-200">
                  {iconPreview ? (
                    <img src={iconPreview} alt="Icon Preview" className="w-full h-full object-cover" />
                  ) : (
                    // Use DiceBear as placeholder if name is available, else generic icon
                    name ?
                    <img src={getDiceBearAvatar(DICEBEAR_STYLES.AGENT, name, { backgroundColor: ['transparent'] })} alt="Agent Icon Placeholder" className="w-full h-full object-cover" />
                    : <ArrowUpTrayIcon className="h-10 w-10 text-base-content/40 group-hover:text-primary" />
                  )}
                </div>
              </label>
              <input id="agent-icon-upload" type="file" className="hidden" accept="image/*" onChange={handleIconChange} />
              {iconPreview && (
                 <button
                    type="button"
                    className="btn btn-xs btn-ghost text-error"
                    onClick={() => {
                        setSelectedIconFile(null);
                        setIconPreview(null); // Allow clearing to no icon
                        const fileInput = document.getElementById('agent-icon-upload') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                    }}
                 >
                   Remove Icon
                 </button>
              )}
            </div>
            <p className="text-xs text-base-content/60 mt-1">Recommended: Square image, 128x128px or larger.</p>
        </div>

        {/* Conditionally show System Prompt for 'prompt' or advanced manual scenarios */}
        {(creationMethod === 'prompt' || systemPrompt) && (
            <div className="form-control">
                <label className="label" htmlFor="agent-system-prompt">
                    <span className="label-text text-base">System Prompt (Advanced)</span>
                </label>
                <textarea
                    id="agent-system-prompt"
                    className="textarea textarea-bordered w-full font-mono text-sm"
                    placeholder="Enter the core instructions or personality for your AI agent..."
                    rows={5}
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                ></textarea>
                 <p className="text-xs text-base-content/60 mt-1">This is often auto-generated or configured in later steps for non-manual modes.</p>
            </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <button className="btn btn-ghost" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Next: Configure Agent</button>
      </div>
    </div>
  );
};

export default AgentBasicInfoStep;