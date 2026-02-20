const express = require('express');
const router = express.Router();
const { getDashboardStats, getReferralTree } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDashboardStats);
router.get('/referrals/tree', protect, getReferralTree);

module.exports = router;
