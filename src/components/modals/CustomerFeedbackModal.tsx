import React, { useState } from 'react';
import { X, Star, ThumbsUp } from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

export const CustomerFeedbackModal: React.FC = () => {
  const { feedbackPackageId, setFeedbackPackageId, submitCustomerRating, packages } = useLogistics();

  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  if (!feedbackPackageId) return null;

  const currentPkg = packages.find(p => p.id === feedbackPackageId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCustomerRating(
      feedbackPackageId,
      score,
      comment.trim() || 'Prompt delivery, handled with care.'
    );
    setFeedbackPackageId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Customer Delivery Feedback
              </h3>
              <p className="text-xs text-neutral-500">
                Rate service for shipment {feedbackPackageId}
              </p>
            </div>
          </div>
          <button
            onClick={() => setFeedbackPackageId(null)}
            className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="text-center space-y-2 py-2">
            <span className="text-neutral-500 text-xs block">
              How was your handover with courier {currentPkg?.assignedCourierName || 'agent'}?
            </span>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onMouseEnter={() => setHoverRating(val)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setScore(val)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      val <= (hoverRating || score) ? 'fill-current text-amber-500' : 'text-neutral-300 dark:text-neutral-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block">
              {score === 5 ? 'Excellent Delivery' : score === 4 ? 'Good Service' : score === 3 ? 'Average' : 'Needs Improvement'}
            </span>
          </div>

          <div>
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
              Share your review & experience (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Driver was on time, package was in perfect condition..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setFeedbackPackageId(null)}
              className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
