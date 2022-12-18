import express from "express";
import { createCabin, getCabins } from "../controllers/cabins.js";

const router = express.Router();

// router.get("/", getCourses);
router.get("/", getCabins);
router.post("/", createCabin);
export default router;
