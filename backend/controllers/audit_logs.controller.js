import { getAllAudit_logs, getAudit_logsById, createAudit_logs, updateAudit_logs, deleteAudit_logs } from '../services/audit_logs.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllAudit_logs({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all audit_logs failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table audit_logs does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching audit_logs: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getAudit_logsById(id);
		if (!data) return res.status(404).json({ message: `audit_logs not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get audit_logs by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching audit_logs: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const audit_logs = req.body;
	try {
		const data = await createAudit_logs(audit_logs);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert audit_logs failed: ${error.message}`, { data: audit_logs, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `audit_logs already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting audit_logs: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const audit_logs = req.body;
	try {
		const success = await updateAudit_logs(id, audit_logs);
		if (!success) return res.status(404).json({ message: `audit_logs not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update audit_logs failed: ${error.message}`, { id, data: audit_logs, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating audit_logs: ${error.message}` });
		}
	}
};

export const deleteaudit_logs = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteAudit_logs(id);
		if (!success) return res.status(404).json({ message: `audit_logs not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete audit_logs failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting audit_logs: ${error.message}` });
		}
	}
};
