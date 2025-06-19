import React from "react";

interface Post {
  id: string;
  companyname: string;
  contactperson: string;
  contactnumber: string;
  typeclient: string;
  activitystatus: string;
  ticketreferencenumber: string;
  date_created: string;
  date_updated: string | null;
  activitynumber: string;
  remarks?: string;
}

interface Activity {
  id: number;
  date_created: string;
  typeactivity: string;
  startdate: string;
  enddate: string;
  callback?: string;
  callstatus?: string;
  typecall?: string;
  quotationnumber?: string;
  quotationamount?: string;
  soamount?: string;
  sonumber?: string;
  actualsales?: string;
  remarks?: string;
  activitystatus?: string;
}

interface PrioritiesProps {
  post: Post;
  activities: Activity[];
  daysThreshold?: number; // Optional threshold for follow-up days, default 7
}

const DAYS_THRESHOLD_DEFAULT = 7;

const Priorities: React.FC<PrioritiesProps> = ({
  post,
  activities,
  daysThreshold = DAYS_THRESHOLD_DEFAULT,
}) => {
  // Calculate days since last activity
  const daysSinceLastActivity = (activities: Activity[]) => {
    if (activities.length === 0) return null;
    const latest = activities.reduce((a, b) =>
      new Date(a.date_created) > new Date(b.date_created) ? a : b
    );
    const diffMs = Date.now() - new Date(latest.date_created).getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  };

  // Count callbacks without quotation
  const hasMultipleCallbacksNoQuotation = (activities: Activity[]) => {
    const callbacks = activities.filter((a) => a.typecall === "callback");
    const hasQuotation = activities.some((a) => a.quotationnumber);
    return callbacks.length >= 2 && !hasQuotation;
  };

  // Check pending status duration in days
  const pendingStatusDuration = (post: Post) => {
    if (post.activitystatus.toLowerCase() !== "cold") return null;
    const created = new Date(post.date_created).getTime();
    const diffMs = Date.now() - created;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  };

  // Check remarks for keywords
  const remarksHasLowPriorityKeywords = (remarks?: string) => {
    if (!remarks) return false;
    const keywords = ["not interested", "waiting", "no budget"];
    const lowerRemarks = remarks.toLowerCase();
    return keywords.some((k) => lowerRemarks.includes(k));
  };

  // Check remarks for negative feedback keywords
  const remarksHasNegativeFeedback = (remarks?: string) => {
    if (!remarks) return false;
    const negativeKeywords = ["complaint", "issue", "unsatisfied", "problem"];
    const lowerRemarks = remarks.toLowerCase();
    return negativeKeywords.some((k) => lowerRemarks.includes(k));
  };

  // Compute priority level
  const computePriority = (activities: Activity[]) => {
    let totalValue = 0;
    activities.forEach((a) => {
      const q = parseFloat(a.quotationamount || "0");
      const so = parseFloat(a.soamount || "0");
      totalValue += (isNaN(q) ? 0 : q) + (isNaN(so) ? 0 : so);
    });

    const numActivities = activities.length;
    const daysSinceLast = daysSinceLastActivity(activities) ?? 1000;

    if (totalValue > 10000 || numActivities > 10 || daysSinceLast <= 3) {
      return "High";
    }
    if (totalValue > 1000 || numActivities > 5 || daysSinceLast <= daysThreshold) {
      return "Medium";
    }
    return "Low";
  };

  // Check for urgent activities
  const hasUrgentActivity = activities.some(
    (a) => a.activitystatus?.toLowerCase() === "urgent"
  );

  // Count failed or no answer calls
  const failedCalls = activities.filter(
    (a) => a.callstatus === "failed" || a.callstatus === "no answer"
  );

  // Calculate total quotation and actual sales
  const totalQuotation = activities.reduce(
    (sum, a) => sum + (parseFloat(a.quotationamount || "0") || 0),
    0
  );
  const totalActualSales = activities.reduce(
    (sum, a) => sum + (parseFloat(a.actualsales || "0") || 0),
    0
  );

  // Calculate priority and labels
  const priority = computePriority(activities);
  const daysLastActivity = daysSinceLastActivity(activities);

  const labels: string[] = [];

  if (daysLastActivity !== null && daysLastActivity > daysThreshold) {
    labels.push(`Follow up suggested — last activity was ${daysLastActivity} days ago.`);
  }

  if (daysLastActivity !== null && daysLastActivity > 30) {
    labels.push("Critical — follow-up overdue for more than 30 days.");
  }

  if (hasMultipleCallbacksNoQuotation(activities)) {
    labels.push("Consider escalation — multiple callbacks without quotation.");
  }

  const pendingDays = pendingStatusDuration(post);
  if (pendingDays !== null && pendingDays > daysThreshold) {
    labels.push("Consider changing status to In Progress or Closed.");
  }

  if (remarksHasLowPriorityKeywords(post.remarks)) {
    labels.push("Low priority — remarks suggest delay or no interest.");
  }

  if (remarksHasNegativeFeedback(post.remarks)) {
    labels.push("Attention needed — negative feedback noted.");
  }

  if (hasUrgentActivity) {
    labels.push("Urgent activity detected.");
  }

  if (failedCalls.length > 3) {
    labels.push("Multiple unsuccessful calls — consider alternative contact method.");
  }

  if (totalQuotation > 1000 && totalActualSales < totalQuotation * 0.5) {
    labels.push(
      "Sales conversion low — quotation amounts not reflected in actual sales."
    );
  }

  // Optional: Last contacted date display
  const lastContactDate =
    activities.length > 0
      ? new Date(
          activities.reduce((a, b) =>
            new Date(a.date_created) > new Date(b.date_created) ? a : b
          ).date_created
        ).toLocaleDateString()
      : "N/A";

  return (
    <div className="priorities-component">
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold select-none
          ${
            priority === "High"
              ? "bg-red-500 text-white"
              : priority === "Medium"
              ? "bg-yellow-400 text-black"
              : "bg-green-300 text-black"
          }
        `}
        aria-label={`${priority} priority level`}
        title={`Priority: ${priority}. Last contacted: ${lastContactDate}`}
      >
        {priority} Priority
      </span>

      {labels.length > 0 && (
        <ul className="mt-1 space-y-1">
          {labels.map((label, idx) => (
            <li
              key={idx}
              className="text-[10px] italic text-red-600 font-semibold"
              title={label}
            >
              ⚠️ {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Priorities;
