import {Router} from "express";
import {
  subscribe,
  confirm,
  unsubscribe,
  getSubscriptions,
} from "../controllers/subscriptionController.js";

const router = Router();

router.post("/subscribe", subscribe);
router.get("/confirm/:token", confirm);
router.get("/unsubscribe/:token", unsubscribe);
router.get("/subscriptions", getSubscriptions);

export default router;
