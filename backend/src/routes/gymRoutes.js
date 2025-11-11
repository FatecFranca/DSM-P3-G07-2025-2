import { Router } from 'express'
import * as gymController from '../controllers/gymController.js'
import authenticateToken from '../middleware/authenticateToken.js'
const router = Router()
router.post('/', authenticateToken, gymController.createGym)
router.get('/', authenticateToken, gymController.getGyms)
router.delete('/:id', authenticateToken, gymController.deleteGym)
export default router