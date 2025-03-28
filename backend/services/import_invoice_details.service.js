import Import_invoice_details from '../models/import_invoice_details.model.js';
import logger from '../common/logger.js';

export const getAllImport_invoice_details = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Import_invoice_details.getAll({ limit, offset });
		const [countResult] = await Import_invoice_details.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all import_invoice_details failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getImport_invoice_detailsById = async (id) => {
	try {
		const [rows] = await Import_invoice_details.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get import_invoice_details by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createImport_invoice_details = async (import_invoice_details) => {
	try {
		if (!import_invoice_details || Object.keys(import_invoice_details).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Import_invoice_details.insert(import_invoice_details);
		return { id: result.insertId, ...import_invoice_details };
	} catch (error) {
		logger.error(`Create import_invoice_details failed: ${error.message}`, { data: import_invoice_details, stack: error.stack });
		throw error;
	}
};

export const updateImport_invoice_details = async (id, import_invoice_details) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!import_invoice_details || Object.keys(import_invoice_details).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Import_invoice_details.update(id, import_invoice_details);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update import_invoice_details failed: ${error.message}`, { id, data: import_invoice_details, stack: error.stack });
		throw error;
	}
};

export const deleteImport_invoice_details = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Import_invoice_details.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete import_invoice_details failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
