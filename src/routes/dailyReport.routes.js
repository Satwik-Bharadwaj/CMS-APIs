const express = require('express');
const router = express.Router();
const dailyReportController = require('../controllers/dailyReport.controller');

router.get('/all', dailyReportController.getAllDailyReports);
router.post('/create', dailyReportController.createDailyReport);
router.put('/update/:id', dailyReportController.updateDailyReport);

module.exports = router; 