import express from "express";
import getTotalPositionsCount from "../../../controller/PositionPageControllers/positionPageAnalyticsController/getTotalPositionsCount.js";
import getOpenPositions from "../../../controller/PositionPageControllers/positionPageAnalyticsController/getOpenPositions.js";
import getClosedPositionsCount from "../../../controller/PositionPageControllers/positionPageAnalyticsController/getClosedPositionsCount.js";
import getApplicationsCount from "../../../controller/PositionPageControllers/positionPageAnalyticsController/getApplicationsCount.js";
import getHiredThisMonthCount from "../../../controller/PositionPageControllers/positionPageAnalyticsController/getHiredThisMonthCount.js";

const router = express.Router();

// Position Analytics Routes - Updated to match testing guide URLs
router.get("/total-positions", getTotalPositionsCount);
router.get("/open-positions", getOpenPositions);
router.get("/closed-positions", getClosedPositionsCount);
router.get("/applications-count", getApplicationsCount);
router.get("/hired-this-month", getHiredThisMonthCount);

export default router;
