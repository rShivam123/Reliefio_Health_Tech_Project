"use client";

import { WorkingDay, TimeRange } from "@/types/doctor";

interface AvailabilityFormProps {
  workingDays: WorkingDay[];
  slotDuration: number;
  onChange: (workingDays: WorkingDay[]) => void;
  onSlotDurationChange: (duration: number) => void;
}

export default function AvailabilityForm({ workingDays, slotDuration, onChange, onSlotDurationChange }: AvailabilityFormProps) {
  const updateDay = (index: number, patch: Partial<WorkingDay>) => {
    const next = workingDays.map((d, i) => (i === index ? { ...d, ...patch } : d));
    onChange(next);
  };

  const updateRange = (dayIndex: number, rangeIndex: number, patch: Partial<TimeRange>) => {
    const day = workingDays[dayIndex];
    const ranges = day.ranges.map((r, i) => (i === rangeIndex ? { ...r, ...patch } : r));
    updateDay(dayIndex, { ranges });
  };

  const addRange = (dayIndex: number) => {
    const day = workingDays[dayIndex];
    updateDay(dayIndex, { ranges: [...day.ranges, { start: "09:00", end: "13:00" }] });
  };

  const removeRange = (dayIndex: number, rangeIndex: number) => {
    const day = workingDays[dayIndex];
    updateDay(dayIndex, { ranges: day.ranges.filter((_, i) => i !== rangeIndex) });
  };

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Consultation Duration (minutes)</label>
        <select
          value={slotDuration}
          onChange={(e) => onSlotDurationChange(Number(e.target.value))}
          className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[15, 20, 30, 45, 60].map((d) => (
            <option key={d} value={d}>
              {d} minutes
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {workingDays.map((day, dayIndex) => (
          <div key={day.day} className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={day.isAvailable}
                  onChange={(e) => updateDay(dayIndex, { isAvailable: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-gray-800 w-24">{day.day}</span>
              </label>

              {day.isAvailable && (
                <button
                  type="button"
                  onClick={() => addRange(dayIndex)}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  + Add time range
                </button>
              )}
            </div>

            {day.isAvailable && (
              <div className="mt-3 space-y-2 pl-7">
                {day.ranges.length === 0 && (
                  <p className="text-xs text-gray-400">No time ranges set. Add one to accept bookings this day.</p>
                )}
                {day.ranges.map((range, rangeIndex) => (
                  <div key={rangeIndex} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={range.start}
                      onChange={(e) => updateRange(dayIndex, rangeIndex, { start: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="time"
                      value={range.end}
                      onChange={(e) => updateRange(dayIndex, rangeIndex, { end: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeRange(dayIndex, rangeIndex)}
                      className="text-red-500 hover:text-red-700 text-lg px-1"
                      aria-label="Remove range"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
