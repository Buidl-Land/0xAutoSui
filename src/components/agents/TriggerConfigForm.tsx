"use client";

import React from 'react';
import { TriggerType, TriggerConfig, ScheduledTriggerConfig, ScheduledTriggerFrequency } from '@/types/agent';

interface TriggerConfigFormProps {
  triggerType: TriggerType;
  triggerConfig: TriggerConfig | null;
  onTriggerTypeChange: (type: TriggerType) => void;
  onTriggerConfigChange: (config: TriggerConfig | null) => void;
}

const TriggerConfigForm: React.FC<TriggerConfigFormProps> = ({
  triggerType,
  triggerConfig,
  onTriggerTypeChange,
  onTriggerConfigChange,
}) => {
  const handleScheduledConfigChange = (field: keyof ScheduledTriggerConfig, value: string) => {
    const newConfig: ScheduledTriggerConfig = {
      ...(triggerConfig as ScheduledTriggerConfig),
      [field]: value,
    };
    // Ensure frequency is correctly typed if it's being set
    if (field === 'frequency') {
      newConfig.frequency = value as ScheduledTriggerFrequency;
    }
    onTriggerConfigChange(newConfig);
  };

  return (
    <div className="mb-8 p-6 bg-base-100 rounded-lg shadow">
      <h3 className="text-xl font-medium mb-4">Trigger Configuration</h3>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-base">Trigger Type</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          {(Object.keys(TriggerType) as Array<keyof typeof TriggerType>).map((key) => (
            <label key={key} className="label cursor-pointer">
              <input
                type="radio"
                name="triggerType"
                className="radio radio-primary"
                value={TriggerType[key]}
                checked={triggerType === TriggerType[key]}
                onChange={() => {
                  onTriggerTypeChange(TriggerType[key]);
                  if (TriggerType[key] !== TriggerType.SCHEDULED) {
                    onTriggerConfigChange(null);
                  } else {
                    // Initialize with default scheduled config if switching to scheduled
                    onTriggerConfigChange({
                      frequency: ScheduledTriggerFrequency.DAILY,
                      timeValue: '09:00',
                    } as ScheduledTriggerConfig);
                  }
                }}
                disabled={TriggerType[key] === TriggerType.EVENT_DRIVEN}
              />
              <span className="label-text ml-2">
                {TriggerType[key].charAt(0) + TriggerType[key].slice(1).toLowerCase().replace('_', ' ')}
                {TriggerType[key] === TriggerType.EVENT_DRIVEN && <span className="text-xs text-base-content/50 ml-1">(Future Feature)</span>}
              </span>
            </label>
          ))}
        </div>
      </div>

      {triggerType === TriggerType.SCHEDULED && (
        <>
          <div className="form-control mb-4">
            <label className="label" htmlFor="trigger-frequency">
              <span className="label-text text-base">Frequency</span>
            </label>
            <select
              id="trigger-frequency"
              name="frequency"
              className="select select-bordered w-full"
              value={(triggerConfig as ScheduledTriggerConfig)?.frequency || ScheduledTriggerFrequency.DAILY}
              onChange={(e) => handleScheduledConfigChange('frequency', e.target.value)}
            >
              {(Object.keys(ScheduledTriggerFrequency) as Array<keyof typeof ScheduledTriggerFrequency>).map(key => (
                <option key={key} value={ScheduledTriggerFrequency[key]}>
                  {ScheduledTriggerFrequency[key].charAt(0) + ScheduledTriggerFrequency[key].slice(1).toLowerCase().replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label" htmlFor="trigger-timeValue">
              <span className="label-text text-base">
                { (triggerConfig as ScheduledTriggerConfig)?.frequency === ScheduledTriggerFrequency.CUSTOM_CRON ? 'Cron Expression' : 'Time' }
              </span>
            </label>
            <input
              id="trigger-timeValue"
              name="timeValue"
              type={(triggerConfig as ScheduledTriggerConfig)?.frequency === ScheduledTriggerFrequency.CUSTOM_CRON ? 'text' : 'time'}
              placeholder={(triggerConfig as ScheduledTriggerConfig)?.frequency === ScheduledTriggerFrequency.CUSTOM_CRON ? 'e.g., 0 0 * * *' : 'e.g., 09:00'}
              className="input input-bordered w-full"
              value={(triggerConfig as ScheduledTriggerConfig)?.timeValue || ''}
              onChange={(e) => handleScheduledConfigChange('timeValue', e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TriggerConfigForm;