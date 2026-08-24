"use client";

import { useState } from "react";
import { createReview } from "@/services/reviewServices";
import Spinner from "@/Components/shared/Spinner";

interface ReviewModalProps {
  appointmentId: string;
  doctorName: string;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function ReviewModal({ appointmentId, doctorName, onClose, onSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");
      await createReview({ appointmentId, rating, comment: comment || undefined });
      onSubmitted();
      onClose();
    } catch (err) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none">
          &times;
        </button>

        <h3 className="text-lg font-bold text-gray-900">Rate your visit</h3>
        <p className="text-sm text-gray-500 mt-1">with {doctorName}</p>

        <div className="flex gap-1 mt-5 text-3xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`${star} star`}
              className={star <= rating ? "text-yellow-400" : "text-gray-200"}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience (optional)"
          className="w-full mt-4 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
        >
          {submitting && <Spinner />}
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
