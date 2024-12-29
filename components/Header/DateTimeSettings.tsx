import React from "react";
import { useDateTimeSettings } from "@/app/DateTimeContext";

interface DateTimeSettingsProps {
  isOpen: boolean;
}

export const DateTimeSettings: React.FC<DateTimeSettingsProps> = ({
  isOpen,
}) => {
  const { settings, updateSettings } = useDateTimeSettings();

  const handleAutoDetectTimezone = () => {
    const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    updateSettings({ timezone: systemTimezone });
  };

  if (!isOpen) return null;

  return (
    <ul
      data-datetime-settings
      className="menu shadow bg-base-200 rounded-box w-64 absolute right-0 translate-x-[calc(100%+2.5rem)] top-0 z-[9999]"
    >
      <div className="p-4 space-y-4">
        <h3 className="font-semibold mb-2">Date & Time Settings</h3>

        <div className="form-control">
          <label className="label cursor-pointer justify-between">
            <span className="label-text">24-hour format</span>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={settings.use24Hour}
              onChange={(e) => updateSettings({ use24Hour: e.target.checked })}
            />
          </label>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-between">
            <span className="label-text">US Date Format</span>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={settings.useUSDateFormat}
              onChange={(e) =>
                updateSettings({ useUSDateFormat: e.target.checked })
              }
            />
          </label>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-between">
            <span className="label-text">Show Seconds</span>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={settings.showSeconds}
              onChange={(e) =>
                updateSettings({ showSeconds: e.target.checked })
              }
            />
          </label>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Timezone</span>
          </label>
          <div className="flex flex-col gap-2">
            <select
              className="select select-sm select-bordered w-full"
              value={settings.timezone}
              onChange={(e) => updateSettings({ timezone: e.target.value })}
            >
              {Intl.supportedValuesOf("timeZone").map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <button
              onClick={handleAutoDetectTimezone}
              className="btn btn-sm btn-outline w-full"
            >
              Auto Detect Timezone
            </button>
          </div>
        </div>
      </div>
    </ul>
  );
};
