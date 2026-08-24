"use client";

import { DoctorFilters as DoctorFiltersType } from "@/types/doctor";

interface DoctorFiltersProps {
  specialties: string[];
  filters: DoctorFiltersType;
  onChange: (patch: Partial<DoctorFiltersType>) => void;
  onApply: () => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const SORT_OPTIONS: { value: NonNullable<DoctorFiltersType["sort"]>; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Highest Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "fee_low", label: "Lowest Consultation Fee" },
  { value: "fee_high", label: "Highest Consultation Fee" },
];

export default function DoctorFilters({
  specialties,
  filters,
  onChange,
  onApply,
  onClear,
  isOpen,
  onClose,
}: DoctorFiltersProps) {
  const content = (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
        <select
          value={filters.sort || "recommended"}
          onChange={(e) => onChange({ sort: e.target.value as DoctorFiltersType["sort"] })}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Specialty</label>
        <select
          value={filters.specialty || ""}
          onChange={(e) => onChange({ specialty: e.target.value || undefined })}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Specialties</option>
          {specialties.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
        <input
          type="text"
          value={filters.location || ""}
          onChange={(e) => onChange({ location: e.target.value || undefined })}
          placeholder="City or area"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Consultation Type</label>
        <div className="flex gap-2">
          {["Online", "In-Person"].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onChange({ consultationType: filters.consultationType === mode ? undefined : mode })}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition ${
                filters.consultationType === mode
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Experience (years)</label>
        <select
          value={filters.minExperience ?? ""}
          onChange={(e) => onChange({ minExperience: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any</option>
          <option value="2">2+ years</option>
          <option value="5">5+ years</option>
          <option value="10">10+ years</option>
          <option value="15">15+ years</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Consultation Fee (₹)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minFee ?? ""}
            onChange={(e) => onChange({ minFee: e.target.value ? Number(e.target.value) : undefined })}
            className="w-1/2 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxFee ?? ""}
            onChange={(e) => onChange({ maxFee: e.target.value ? Number(e.target.value) : undefined })}
            className="w-1/2 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rating</label>
        <select
          value={filters.minRating ?? ""}
          onChange={(e) => onChange({ minRating: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any</option>
          <option value="3">3+ stars</option>
          <option value="4">4+ stars</option>
          <option value="4.5">4.5+ stars</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onClear}
          type="button"
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
        >
          Clear Filters
        </button>
        <button
          onClick={() => {
            onApply();
            onClose();
          }}
          type="button"
          className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-6">
          <h2 className="font-bold text-gray-900 mb-4">Filters</h2>
          {content}
        </div>
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="relative ml-auto w-full max-w-sm bg-white h-full overflow-y-auto p-5 animate-[slideIn_0.2s_ease-out]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Filters</h2>
              <button onClick={onClose} aria-label="Close filters" className="text-gray-400 hover:text-gray-700 text-2xl leading-none">
                &times;
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
