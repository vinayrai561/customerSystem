// routes/agentRoutes.ts
import { Router } from "express";
import agentController from "../controllers/agentController.js";
const router = Router();

router.get('/getAgentHtml', agentController.getAgentHtml);
router.get('/get_message', agentController.getCustomerMessageForReply);
router.post('/send_reply', agentController.sendReply);
router.get('/get_all_messages', agentController.getAllCustomerMessages);

export default router;
