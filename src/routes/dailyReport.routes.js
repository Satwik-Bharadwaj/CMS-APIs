const express = require('express');
const router = express.Router();
const dailyReportController = require('../controllers/dailyReport.controller');

router.get('/', dailyReportController.getAllDailyReports);
router.get('/:id', dailyReportController.getDailyReportById);
router.post('/', dailyReportController.createDailyReport);
router.put('/:id', dailyReportController.updateDailyReport);
router.delete('/:id', dailyReportController.deleteDailyReport);

module.exports = router; 