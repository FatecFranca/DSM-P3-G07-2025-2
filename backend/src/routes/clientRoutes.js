import { Router } from 'express'
import * as clientController from '../controllers/clientController.js'
import authenticateToken from '../middleware/authenticateToken.js'
const router = Router()

router.post("/", authenticateToken, clientController.addClient);
router.post("/checkout", authenticateToken, clientController.checkoutClient);
router.get("/", authenticateToken, clientController.getClients);

export default router;