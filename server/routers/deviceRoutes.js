import express from "express";
import { createDevice, getDevices } from "../controllers/devices.js";

const router = express.Router();

// router.get("/", getCourses);
router.get("/", getDevices);
router.post("/", createDevice);
export default router;
