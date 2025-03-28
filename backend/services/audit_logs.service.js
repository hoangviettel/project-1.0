import Audit_logs from '../models/audit_logs.model.js';
import logger from '../common/logger.js';

export const getAllAudit_logs = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Audit_logs.getAll({ limit, offset });
		const [countResult] = await Audit_logs.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all audit_logs failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getAudit_logsById = async (id) => {
	try {
		const [rows] = await Audit_logs.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get audit_logs by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createAudit_logs = async (audit_logs) => {
	try {
		if (!audit_logs || Object.keys(audit_logs).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Audit_logs.insert(audit_logs);
		return { id: result.insertId, ...audit_logs };
	} catch (error) {
		logger.error(`Create audit_logs failed: ${error.message}`, { data: audit_logs, stack: error.stack });
		throw error;
	}
};

export const updateAudit_logs = async (id, audit_logs) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!audit_logs || Object.keys(audit_logs).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Audit_logs.update(id, audit_logs);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update audit_logs failed: ${error.message}`, { id, data: audit_logs, stack: error.stack });
		throw error;
	}
};

export const deleteAudit_logs = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Audit_logs.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete audit_logs failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
