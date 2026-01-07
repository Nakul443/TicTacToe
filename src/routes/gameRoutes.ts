import { Router } from 'express';

const router = Router();

router.get('/status', (req, res) => {
    res.json({ status: 'TicTacToe Server Running' });
});

export default router;