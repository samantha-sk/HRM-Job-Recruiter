import Application from "../../model/applicantSchema.js";

// Get count of applications with status "Applied"
export const getAppliedCount = async (req, res) => {
    try {
        const count = await Application.countDocuments({ profileStatus: "Applied" });
        res.status(200).json({
            success: true,
            count: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching applied applications count",
            error: error.message
        });
    }
};

// Get count of applications with status "Selected"
export const getSelectedCount = async (req, res) => {
    try {
        const count = await Application.countDocuments({ profileStatus: "Selected" });
        res.status(200).json({
            success: true,
            count: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching selected applications count",
            error: error.message
        });
    }
};

// Get count of applications with status "Hired"
export const getHiredCount = async (req, res) => {
    try {
        const count = await Application.countDocuments({ profileStatus: "Hired" });
        res.status(200).json({
            success: true,
            count: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching hired applications count",
            error: error.message
        });
    }
};

// Get count of applications with status "Rejected"
export const getRejectedCount = async (req, res) => {
    try {
        const count = await Application.countDocuments({ profileStatus: "Rejected" });
        res.status(200).json({
            success: true,
            count: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching rejected applications count",
            error: error.message
        });
    }
};
