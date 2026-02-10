import candidateDetails from "../../model/scheduleModel.js";

function formatTimeRange(startTime) {
  if (!startTime) return null;

  // Parse time (e.g., "15:00" or "03:00 PM")
  let date = new Date(`1970-01-01T${startTime}`);
  if (isNaN(date.getTime())) {
    // fallback if stored as "03:00 PM"
    date = new Date(`1970-01-01 ${startTime}`);
  }

  // Start time formatted
  const start = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  // End time = start + 1 hour
  const endDate = new Date(date.getTime() + 60 * 60 * 1000);
  const end = endDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  return `${start} - ${end}`;
}

const getTodaySchedules = async (req, res) => {
  try {
    // Today filter
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const schedules = await candidateDetails.find({
      Date: { $gte: todayStart, $lte: todayEnd }
    });

    const formatted = schedules.map(schedule => ({
      name: schedule.Candidate,
      interviewTime: formatTimeRange(schedule.Time), // formatted range
      interviewMode: schedule.Mode,
      action: schedule.Mode === "Offline" ? "View" : "Start Interview"
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default getTodaySchedules;