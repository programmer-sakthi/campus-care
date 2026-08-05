import { Router } from "express";

import {
  createStudent
} from "./student.controller";


const router = Router();


router.post(
  "/",
  createStudent
);


export default router;