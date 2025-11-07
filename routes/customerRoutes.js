// routes/customerRoutes.ts
import { Router } from "express";
import customerController from "../controllers/customerController.js";

const router = Router();

router.get("/getCustomerHtml", customerController.getMessageHtml);
router.post("/send_message", customerController.sendMessage);
router.get("/get_reply/:messageId", customerController.getReplies);
router.get("/get_messages_by_email", customerController.getMessagesByEmail);

export default router;
