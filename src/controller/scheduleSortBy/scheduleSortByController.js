
import candidateDetails from "../../model/scheduleModel.js";

const scheduleController = {
  // Generic API - Filter by any Status
  getSchedulesByStatus: async (req, res, status) => {
    try {
      // Optionally, you can filter by Position as well
      const { Position } = req.query;
      const query = { Status: status };
      if (Position) {
        query.Position = { $regex: new RegExp(Position, "i") };
      }
      const schedules = await candidateDetails.find(query);
      if (!schedules.length) {
        return res.status(404).json({
          success: false,
          message: `No schedules found with status ${status}`,
        });
      }
      const formatted = schedules.map(schedule => ({
        name: schedule.Candidate,
        interviewTime: schedule.Time,
        interviewMode: schedule.Mode,
        action: schedule.Mode === "Offline" ? "View" : "Start Interview",
      }));
      res.status(200).json({ success: true, data: formatted });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // API 3 - Filter by Reject Status
  getRejectedSchedules: async (req, res) => {
    try {
      // Optionally, you can filter by Position as well
      const { Position } = req.query;
      const query = { Status: 'Reject' };
      if (Position) {
        query.Position = { $regex: new RegExp(Position, "i") };
      }
      const schedules = await candidateDetails.find(query);
      if (!schedules.length) {
        return res.status(404).json({
          success: false,
          message: "No rejected schedules found",
        });
      }
      const formatted = schedules.map(schedule => ({
        name: schedule.Candidate,
        interviewTime: schedule.Time,
        interviewMode: schedule.Mode,
        action: schedule.Mode === "Offline" ? "View" : "Start Interview",
      }));
      res.status(200).json({ success: true, data: formatted });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // API 1 - Filter by Status & Position (supports All)
  getSchedulesByStatusAndPosition: async (req, res) => {
    try {
      const { Position, Status } = req.query;

      // Validate input
      if (!Position || !Status) {
        return res.status(400).json({
          success: false,
          message: "Position and Status are required",
        });
      }

      const validStatuses = ["Completed", "Upcoming", "Incomplete", "Hired", "On Hold"];
      const normalizedStatus = Status.toLowerCase();

      if (normalizedStatus !== "all" && !validStatuses.map(s => s.toLowerCase()).includes(normalizedStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Use one of: All, ${validStatuses.join(", ")}`,
        });
      }

      // Build query
      const query = {
        Position: { $regex: new RegExp(Position, "i") }
      };

      if (normalizedStatus !== "all") {
        query.Status = validStatuses.find(s => s.toLowerCase() === normalizedStatus);
      }

      const schedules = await candidateDetails.find(query);

      if (!schedules.length) {
        return res.status(404).json({
          success: false,
          message: "No schedules found for given filters",
        });
      }

      const formatted = schedules.map(schedule => ({
        name: schedule.Candidate,
        interviewTime: schedule.Time,
        interviewMode: schedule.Mode,
        action: schedule.Mode === "Offline" ? "View" : "Start Interview",
      }));

      res.status(200).json({ success: true, data: formatted });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // API 2 - Filter by Date Range

  getSchedulesByDateRange: async (req, res) => {
    try {
      let { From, To, start, end } = req.query;

      // Support both parameter naming conventions
      const fromDate = From || start;
      const toDate = To || end;

      // Validate input
      if (!fromDate || !toDate) {
        return res.status(400).json({
          success: false,
          message: "From/start and To/end dates are required",
        });
      }

      const startDate = new Date(fromDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);

      const query = { Date: { $gte: startDate, $lte: endDate } };

      const schedules = await candidateDetails.find(query);

      if (!schedules.length) {
        return res.status(404).json({
          success: false,
          message: "No schedules found in given date range",
        });
      }

      const formatted = schedules.map(schedule => ({
        name: schedule.Candidate,
        interviewTime: schedule.Time,
        interviewMode: schedule.Mode,
        action: schedule.Mode === "Offline" ? "View" : "Start Interview",
      }));

      res.status(200).json({ success: true, data: formatted });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

};

export default scheduleController;