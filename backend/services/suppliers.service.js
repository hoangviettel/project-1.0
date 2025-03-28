import Suppliers from '../models/suppliers.model.js';
import logger from '../common/logger.js';

export const getAllSuppliers = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Suppliers.getAll({ limit, offset });
		const [countResult] = await Suppliers.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all suppliers failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getSuppliersById = async (id) => {
	try {
		const [rows] = await Suppliers.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get suppliers by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createSuppliers = async (suppliers) => {
	try {
		if (!suppliers || Object.keys(suppliers).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Suppliers.insert(suppliers);
		return { id: result.insertId, ...suppliers };
	} catch (error) {
		logger.error(`Create suppliers failed: ${error.message}`, { data: suppliers, stack: error.stack });
		throw error;
	}
};

export const updateSuppliers = async (id, suppliers) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!suppliers || Object.keys(suppliers).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Suppliers.update(id, suppliers);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update suppliers failed: ${error.message}`, { id, data: suppliers, stack: error.stack });
		throw error;
	}
};

export const deleteSuppliers = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Suppliers.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete suppliers failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
