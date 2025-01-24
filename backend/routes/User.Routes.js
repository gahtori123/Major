import { googleSignUp } from "../controllers/User.Controllers.js";
import {Router} from 'express';

const router = Router();

router.post("/google/auth",googleSignUp)

export default router