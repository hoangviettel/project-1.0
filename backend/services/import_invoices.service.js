import Import_invoices from '../models/import_invoices.model.js';
import logger from '../common/logger.js';

export const getAllImport_invoices = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Import_invoices.getAll({ limit, offset });
		const [countResult] = await Import_invoices.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all import_invoices failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getImport_invoicesById = async (id) => {
	try {
		const [rows] = await Import_invoices.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get import_invoices by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createImport_invoices = async (import_invoices) => {
	try {
		if (!import_invoices || Object.keys(import_invoices).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Import_invoices.insert(import_invoices);
		return { id: result.insertId, ...import_invoices };
	} catch (error) {
		logger.error(`Create import_invoices failed: ${error.message}`, { data: import_invoices, stack: error.stack });
		throw error;
	}
};

export const updateImport_invoices = async (id, import_invoices) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!import_invoices || Object.keys(import_invoices).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Import_invoices.update(id, import_invoices);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update import_invoices failed: ${error.message}`, { id, data: import_invoices, stack: error.stack });
		throw error;
	}
};

export const deleteImport_invoices = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Import_invoices.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete import_invoices failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
