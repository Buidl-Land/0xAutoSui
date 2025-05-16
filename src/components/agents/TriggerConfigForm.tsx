"use client";

import React, { useState } from 'react';
import { TriggerType, TriggerConfig, ScheduledTriggerConfig, ScheduledTriggerFrequency, EventType, EventSource, EventDrivenTriggerConfig } from '@/types/agent';

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
  const [newTarget, setNewTarget] = useState('');

  const handleScheduledConfigChange = (field: keyof ScheduledTriggerConfig, value: string) => {
    const newConfig: ScheduledTriggerConfig = {
      ...(triggerConfig as ScheduledTriggerConfig),
      [field]: value,
    };
    if (field === 'frequency') {
      newConfig.frequency = value as ScheduledTriggerFrequency;
    }
    onTriggerConfigChange(newConfig);
  };

  const handleEventConfigChange = (field: keyof EventDrivenTriggerConfig, value: any) => {
    const newConfig: EventDrivenTriggerConfig = {
      ...(triggerConfig as EventDrivenTriggerConfig),
      [field]: value,
    };
    onTriggerConfigChange(newConfig);
  };

  const handleAddTarget = () => {
    if (!newTarget.trim()) return;
    const currentConfig = triggerConfig as EventDrivenTriggerConfig;
    const updatedTargets = [...(currentConfig?.eventTarget || []), newTarget.trim()];
    handleEventConfigChange('eventTarget', updatedTargets);
    setNewTarget('');
  };

  const handleRemoveTarget = (index: number) => {
    const currentConfig = triggerConfig as EventDrivenTriggerConfig;
    const updatedTargets = currentConfig.eventTarget.filter((_, i) => i !== index);
    handleEventConfigChange('eventTarget', updatedTargets);
  };

  const getAvailableEventSources = (eventType: EventType): EventSource[] => {
    switch (eventType) {
      case EventType.ADDRESS_MONITOR:
      case EventType.TRANSACTION_MONITOR:
        return [EventSource.TOKENVIEW, EventSource.BITQUERY];
      case EventType.TWITTER_MONITOR:
        return [EventSource.TWITTER_API, EventSource.RAPID_API];
      default:
        return [];
    }
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
                  if (TriggerType[key] === TriggerType.SCHEDULED) {
                    onTriggerConfigChange({
                      frequency: ScheduledTriggerFrequency.DAILY,
                      timeValue: '09:00',
                    } as ScheduledTriggerConfig);
                  } else if (TriggerType[key] === TriggerType.EVENT_DRIVEN) {
                    onTriggerConfigChange({
                      eventType: EventType.ADDRESS_MONITOR,
                      eventSource: EventSource.TOKENVIEW,
                      eventTarget: [],
                      filterConditions: {},
                    } as EventDrivenTriggerConfig);
                  } else {
                    onTriggerConfigChange(null);
                  }
                }}
              />
              <span className="label-text ml-2">
                {TriggerType[key].charAt(0) + TriggerType[key].slice(1).toLowerCase().replace('_', ' ')}
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
                {(triggerConfig as ScheduledTriggerConfig)?.frequency === ScheduledTriggerFrequency.CUSTOM_CRON ? 'Cron Expression' : 'Time'}
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

      {triggerType === TriggerType.EVENT_DRIVEN && (
        <>
          <div className="form-control mb-4">
            <label className="label" htmlFor="event-type">
              <span className="label-text text-base">Event Type</span>
            </label>
            <select
              id="event-type"
              className="select select-bordered w-full"
              value={(triggerConfig as EventDrivenTriggerConfig)?.eventType || EventType.ADDRESS_MONITOR}
              onChange={(e) => {
                const newEventType = e.target.value as EventType;
                const currentConfig = triggerConfig as EventDrivenTriggerConfig;
                const newConfig: EventDrivenTriggerConfig = {
                  ...currentConfig,
                  eventType: newEventType,
                  eventSource: getAvailableEventSources(newEventType)[0],
                  eventTarget: currentConfig?.eventTarget || [],
                  filterConditions: currentConfig?.filterConditions || {}
                };
                onTriggerConfigChange(newConfig);
              }}
            >
              {Object.values(EventType).map(type => (
                <option key={type} value={type}>
                  {type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control mb-4">
            <label className="label" htmlFor="event-source">
              <span className="label-text text-base">Event Source</span>
            </label>
            <select
              id="event-source"
              className="select select-bordered w-full"
              value={(triggerConfig as EventDrivenTriggerConfig)?.eventSource || EventSource.TOKENVIEW}
              onChange={(e) => handleEventConfigChange('eventSource', e.target.value as EventSource)}
            >
              {getAvailableEventSources((triggerConfig as EventDrivenTriggerConfig)?.eventType || EventType.ADDRESS_MONITOR).map(source => (
                <option key={source} value={source}>
                  {source.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-base">Event Targets</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="input input-bordered flex-1"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                placeholder="Enter target (e.g., address, keyword)"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTarget()}
              />
              <button
                className="btn btn-primary"
                onClick={handleAddTarget}
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {(triggerConfig as EventDrivenTriggerConfig)?.eventTarget?.map((target, index) => (
                <div key={index} className="flex items-center gap-2 bg-base-200 p-2 rounded">
                  <span className="flex-1">{target}</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleRemoveTarget(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TriggerConfigForm;