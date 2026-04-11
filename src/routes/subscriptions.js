import {Router} from "express";
import {
  subscribe,
  confirm,
  unsubscribe,
  getSubscriptions,
} from "../controllers/subscriptionController.js";
import { apiKeyAuth } from "../middlewares/apiKeyMiddleware.js";

const router = Router();

router.post("/subscribe", apiKeyAuth, subscribe);
router.get("/confirm/:token", confirm);
router.get("/unsubscribe/:token", unsubscribe);
router.get("/subscriptions", apiKeyAuth, getSubscriptions);

export default router;
