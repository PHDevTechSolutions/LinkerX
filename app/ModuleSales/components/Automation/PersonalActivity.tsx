"use client";
import React, { useEffect, useState, useRef } from "react";

interface ActivityTemplate {
  id: number;
  status: string;
  remarks: string;
  duration: string;
}

interface Props {
  referenceid: string;
  manager: string;
  tsm: string;
  startdate: string;
  enddate: string;
  activitystatus: string;
  activityremarks: string;
  timeDuration: string;
  setactivitystatus: (val: string) => void;
  setactivityremarks: (val: string) => void;
  setTimeDuration: (val: string) => void;
  calculateEndDate: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setShowPersonalForm: (val: boolean) => void;
}

const statusSuggestions: Record<string, { text: string; emoji: string }> = {
  "Assisting other Agents Client": {
    text: "Helping a teammate handle their client-related concern.",
    emoji: "🤝",
  },
  "Coordination of SO to Warehouse": {
    text: "Coordinated with warehouse for Sales Order processing.",
    emoji: "🏭",
  },
  "Coordination of SO to Orders": {
    text: "Coordinated with Orders team for Sales Order follow-up.",
    emoji: "📦",
  },
  "Updating Reports": {
    text: "Updating internal or client-facing reports.",
    emoji: "📊",
  },
  "Email and Viber Checking": {
    text: "Checking emails and Viber messages for updates or follow-ups.",
    emoji: "📧",
  },
  "1st Break": { text: "Taking a short personal break.", emoji: "☕" },
  "Client Meeting": { text: "In a scheduled client meeting.", emoji: "👥" },
  "Coffee Break": { text: "Quick coffee break to recharge.", emoji: "☕" },
  "Group Meeting": { text: "Participating in a group or team meeting.", emoji: "👨‍👩‍👧‍👦" },
  "Last Break": { text: "Wrapping up with a short end-of-day break.", emoji: "🌇" },
  "Lunch Break": { text: "Taking a lunch break.", emoji: "🍽️" },
  "TSM Coaching": { text: "Being coached by TSM for performance improvement.", emoji: "🎓" },
};

const timeOptions = [
  "1 Minute",
  "5 Minutes",
  "10 Minutes",
  "15 Minutes",
  "20 Minutes",
  "30 Minutes",
  "1 Hour",
  "2 Hours",
  "3 Hours",
];

const MAX_REMARKS_LENGTH = 200;

const PersonalActivity: React.FC<Props> = ({
  referenceid,
  manager,
  tsm,
  startdate,
  enddate,
  activitystatus,
  activityremarks,
  timeDuration,
  setactivitystatus,
  setactivityremarks,
  setTimeDuration,
  calculateEndDate,
  handleSubmit,
  setShowPersonalForm,
}) => {
  const [recentActivities, setRecentActivities] = useState<ActivityTemplate[]>([]);
  const [templates, setTemplates] = useState<ActivityTemplate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [loading, setLoading] = useState(false);

  // For autosave draft keys
  const draftKey = `draft_personal_activity_${referenceid}`;

  // Load recent activities, templates, and draft on mount
  useEffect(() => {
    const storedRecents = localStorage.getItem("recentActivities");
    const storedTemplates = localStorage.getItem("activityTemplates");
    const draft = localStorage.getItem(draftKey);
    if (storedRecents) setRecentActivities(JSON.parse(storedRecents));
    if (storedTemplates) setTemplates(JSON.parse(storedTemplates));
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.status) setactivitystatus(parsed.status);
        if (parsed.remarks) setactivityremarks(parsed.remarks);
        if (parsed.duration) {
          setTimeDuration(parsed.duration);
          calculateEndDate(parsed.duration);
        }
      } catch {}
    }
  }, []);

  // Save recent activities & templates to localStorage when changed
  useEffect(() => {
    localStorage.setItem("recentActivities", JSON.stringify(recentActivities));
  }, [recentActivities]);

  useEffect(() => {
    localStorage.setItem("activityTemplates", JSON.stringify(templates));
  }, [templates]);

  // Auto-fill remarks if empty when status changes
  useEffect(() => {
    if (activitystatus && !activityremarks && statusSuggestions[activitystatus]) {
      setactivityremarks(statusSuggestions[activitystatus].text);
    }
  }, [activitystatus]);

  // Autosave drafts on status, remarks, duration changes (debounced to 1s)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        draftKey,
        JSON.stringify({
          status: activitystatus,
          remarks: activityremarks,
          duration: timeDuration,
        })
      );
    }, 1000);
    return () => clearTimeout(timer);
  }, [activitystatus, activityremarks, timeDuration]);

  // Handle quick fill of recent activity
  const handleFillRecent = (act: ActivityTemplate) => {
    setactivitystatus(act.status);
    setactivityremarks(act.remarks);
    setTimeDuration(act.duration);
    calculateEndDate(act.duration);
    setError(null);
  };

  // Open confirmation modal for saving template
  const confirmSaveTemplate = () => {
    if (!activitystatus || !timeDuration) {
      setError("Cannot save template without status and duration");
      return;
    }
    if (activityremarks.length > MAX_REMARKS_LENGTH) {
      setError(`Remarks must be at most ${MAX_REMARKS_LENGTH} characters.`);
      return;
    }
    setShowConfirmSave(true);
  };

  // Actually save template after confirmation
  const saveTemplate = () => {
    const newTemplate: ActivityTemplate = {
      id: Date.now(),
      status: activitystatus,
      remarks: activityremarks,
      duration: timeDuration,
    };
    setTemplates([newTemplate, ...templates]);
    setError(null);
    setShowConfirmSave(false);
  };

  // When submitting, validate and update recentActivities
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!activitystatus) {
      setError("Please select an activity status.");
      return;
    }
    if (!timeDuration) {
      setError("Please select a time duration.");
      return;
    }
    if (activityremarks.length > MAX_REMARKS_LENGTH) {
      setError(`Remarks must be at most ${MAX_REMARKS_LENGTH} characters.`);
      return;
    }

    setLoading(true);
    try {
      // Save this as recent activity (most recent first)
      const newRecent: ActivityTemplate = {
        id: Date.now(),
        status: activitystatus,
        remarks: activityremarks,
        duration: timeDuration,
      };
      // Keep max 3 recent activities unique by status+remarks+duration
      const filteredRecents = recentActivities.filter(
        (a) =>
          !(
            a.status === newRecent.status &&
            a.remarks === newRecent.remarks &&
            a.duration === newRecent.duration
          )
      );
      setRecentActivities([newRecent, ...filteredRecents].slice(0, 3));

      // Clear draft on successful submit
      localStorage.removeItem(draftKey);

      await handleSubmit(e);
    } catch (err) {
      setError("An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting template
  const handleSelectTemplate = (tmpl: ActivityTemplate) => {
    setactivitystatus(tmpl.status);
    setactivityremarks(tmpl.remarks);
    setTimeDuration(tmpl.duration);
    calculateEndDate(tmpl.duration);
    setError(null);
  };

  // Handle remarks input with tag suggestions (hashtags/emojis)
  // For simplicity, user can manually type #tags or emojis; no complex autocomplete here
  // Just restrict length and show count

  const isSubmitDisabled =
    !activitystatus || !timeDuration || activityremarks.length > MAX_REMARKS_LENGTH || loading;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
        <div className="bg-white p-8 rounded shadow-lg w-96 max-w-lg max-h-[90vh] overflow-y-auto relative">
          <h2 className="text-sm font-bold mb-4">Personal Activity</h2>
          <p className="text-xs text-gray-600 mb-4">
            This form helps track your <strong>personal activities</strong> by selecting an activity type,
            adding remarks, and specifying the time spent.
          </p>

          {/* Recent Activity Suggestions */}
          {recentActivities.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold mb-1">Recent Activities:</p>
              <div className="flex gap-2 flex-wrap">
                {recentActivities.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => handleFillRecent(act)}
                    className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    type="button"
                    title={`${act.status} (${act.duration})`}
                  >
                    {statusSuggestions[act.status]?.emoji || "⚡"} {act.status}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Activity Templates */}
          {templates.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold mb-1">Saved Templates:</p>
              <div className="flex gap-2 flex-wrap">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className="text-xs px-2 py-1 bg-blue-200 rounded hover:bg-blue-300"
                    type="button"
                    title={`${tmpl.status} (${tmpl.duration})`}
                  >
                    {statusSuggestions[tmpl.status]?.emoji || "⭐"} {tmpl.status}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={onSubmit}>
            <input type="hidden" value={referenceid} />
            <input type="hidden" value={tsm} />
            <input type="hidden" value={manager} />
            <input type="hidden" value={startdate} readOnly />
            <input type="hidden" value={enddate} readOnly />

            <select
              value={activitystatus}
              onChange={(e) => setactivitystatus(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded text-xs"
              disabled={loading}
            >
              <option value="">-- Select an Option --</option>
              {Object.entries(statusSuggestions).map(([status, { emoji }]) => (
                <option key={status} value={status}>
                  {emoji} {status}
                </option>
              ))}
            </select>

            <textarea
              value={activityremarks}
              onChange={(e) => setactivityremarks(e.target.value)}
              className={`w-full mb-1 px-3 py-2 border rounded text-xs resize-none ${
                activityremarks.length > MAX_REMARKS_LENGTH ? "border-red-500" : ""
              }`}
              rows={3}
              placeholder="Enter remarks here... (hashtags #tag and emojis allowed)"
              disabled={!activitystatus || loading}
              maxLength={MAX_REMARKS_LENGTH}
            />
            <div className="flex justify-between text-[10px] text-gray-500 mb-3">
              {activitystatus && statusSuggestions[activitystatus] && (
                <p className="italic">
                  ✨ Auto-suggested: "{statusSuggestions[activitystatus].text}"
                </p>
              )}
              <p
                className={`ml-auto ${
                  activityremarks.length > MAX_REMARKS_LENGTH ? "text-red-500" : ""
                }`}
              >
                {activityremarks.length}/{MAX_REMARKS_LENGTH}
              </p>
            </div>

            <select
              value={timeDuration}
              onChange={(e) => {
                setTimeDuration(e.target.value);
                calculateEndDate(e.target.value);
              }}
              className="w-full mb-4 px-3 py-2 border rounded text-xs"
              disabled={loading}
            >
              <option value="">-- Select Time Duration --</option>
              {timeOptions.map((dur) => (
                <option key={dur} value={dur}>
                  {dur}
                </option>
              ))}
            </select>

            {/* Save Template Button */}
            <button
              type="button"
              onClick={confirmSaveTemplate}
              className="mb-4 px-3 py-1 bg-yellow-400 rounded text-xs hover:bg-yellow-500"
              disabled={loading}
            >
              Save Current as Template
            </button>

            {/* Validation Error */}
            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                className="text-xs text-gray-500 hover:underline"
                onClick={() => setShowPersonalForm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded text-xs text-white ${
                  isSubmitDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={isSubmitDisabled}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>

          {/* Confirmation Modal for Save Template */}
          {showConfirmSave && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[1100]">
              <div className="bg-white rounded p-6 w-80 max-w-full text-center">
                <h3 className="font-semibold mb-4">Save Template?</h3>
                <p className="mb-6 text-xs text-gray-700">
                  Are you sure you want to save the current activity as a reusable template?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowConfirmSave(false)}
                    className="px-4 py-2 text-xs rounded border border-gray-400 hover:bg-gray-100"
                    type="button"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveTemplate}
                    className="px-4 py-2 text-xs rounded bg-green-500 text-white hover:bg-green-600"
                    type="button"
                    disabled={loading}
                  >
                    Yes, Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PersonalActivity;
