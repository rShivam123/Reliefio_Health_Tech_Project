"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import DoctorCard from "@/Components/doctors/DoctorCard";
import DoctorFilters from "@/Components/doctors/DoctorFilters";
import Pagination from "@/Components/shared/Pagination";
import EmptyState from "@/Components/shared/EmptyState";
import { SkeletonCard } from "@/Components/shared/Skeleton";
import { getDoctors, getSpecialties } from "@/services/doctorServices";
import { Doctor, DoctorFilters as DoctorFiltersType } from "@/types/doctor";

function DoctorsDirectoryContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<DoctorFiltersType>({
    search: searchParams.get("search") || undefined,
    specialty: searchParams.get("specialty") || undefined,
    sort: "recommended",
    page: 1,
    limit: 9,
  });
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    getSpecialties()
      .then((res) => setSpecialties(res.data || []))
      .catch(() => setSpecialties([]));
  }, []);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getDoctors(filters);
      setDoctors(res.data || []);
      if (res.pagination) {
        setPagination({ page: res.pagination.page, totalPages: res.pagination.totalPages, total: res.pagination.total });
      }
    } catch {
      setError("We couldn't load doctors right now. Please try again in a moment.");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(timeout);
  }, [fetchDoctors]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput || undefined, page: 1 }));
  };

  const handleFilterChange = (patch: Partial<DoctorFiltersType>) => {
    setFilters((f) => ({ ...f, ...patch, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({ search: filters.search, sort: "recommended", page: 1, limit: 9 });
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 text-center">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            Trusted Healthcare Professionals
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Find the Right Doctor for Your Care
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Search and book appointments with verified doctors across specialties, hospitals and locations - all in
            one place.
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto flex gap-3">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by doctor name, specialty, hospital or location..."
              className="flex-1 px-5 py-3.5 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shrink-0"
            >
              Search
            </button>
          </form>
        </section>

        {/* Body */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-center justify-between mb-5 lg:hidden">
            <p className="text-sm text-gray-500">
              {loading ? "Searching..." : `${pagination.total} doctor${pagination.total === 1 ? "" : "s"} found`}
            </p>
            <button
              onClick={() => setFiltersOpen(true)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <span>⚙️</span> Filters
            </button>
          </div>

          <div className="flex gap-8 items-start">
            <DoctorFilters
              specialties={specialties}
              filters={filters}
              onChange={handleFilterChange}
              onApply={fetchDoctors}
              onClear={handleClearFilters}
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
            />

            <div className="flex-1 min-w-0">
              <p className="hidden lg:block text-sm text-gray-500 mb-5">
                {loading ? "Searching..." : `${pagination.total} doctor${pagination.total === 1 ? "" : "s"} found`}
              </p>

              {loading ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : error ? (
                <EmptyState icon="⚠️" title="Something went wrong" message={error} />
              ) : doctors.length === 0 ? (
                <EmptyState
                  icon="🔍"
                  title="No doctors found."
                  message="Try changing your search or filters."
                  action={
                    <button
                      onClick={handleClearFilters}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      Clear Filters
                    </button>
                  }
                />
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {doctors.map((doc) => (
                      <DoctorCard key={doc._id} doctor={doc} />
                    ))}
                  </div>
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
                  />
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default function DoctorsDirectoryPage() {
  return (
    <Suspense fallback={null}>
      <DoctorsDirectoryContent />
    </Suspense>
  );
}
