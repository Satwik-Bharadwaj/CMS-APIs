const db = require('../config/db');

exports.getAllDailyReports = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM DailyReport');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDailyReportById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM DailyReport WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'DailyReport not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createDailyReport = async (req, res) => {
    try {
        const {
            project_id, material_id, material_dr_number, particulars, date,
            amount, paid, balance, units, quantity, remarks
        } = req.body;
        const [result] = await db.query(
            'INSERT INTO DailyReport (project_id, material_id, material_dr_number, particulars, date, amount, paid, balance, units, quantity, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [project_id, material_id, material_dr_number, particulars, date, amount, paid, balance, units, quantity, remarks]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateDailyReport = async (req, res) => {
    try {
        const {
            project_id, material_id, material_dr_number, particulars, date,
            amount, paid, balance, units, quantity, remarks
        } = req.body;
        const [result] = await db.query(
            'UPDATE DailyReport SET project_id=?, material_id=?, material_dr_number=?, particulars=?, date=?, amount=?, paid=?, balance=?, units=?, quantity=?, remarks=? WHERE id=?',
            [project_id, material_id, material_dr_number, particulars, date, amount, paid, balance, units, quantity, remarks, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'DailyReport not found' });
        res.json({ message: 'DailyReport updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteDailyReport = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM DailyReport WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'DailyReport not found' });
        res.json({ message: 'DailyReport deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 