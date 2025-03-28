import Warehouses from '../models/warehouses.model.js';
import logger from '../common/logger.js';

export const getAllWarehouses = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Warehouses.getAll({ limit, offset });
		const [countResult] = await Warehouses.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all warehouses failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getWarehousesById = async (id) => {
	try {
		const [rows] = await Warehouses.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get warehouses by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createWarehouses = async (warehouses) => {
	try {
		if (!warehouses || Object.keys(warehouses).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Warehouses.insert(warehouses);
		return { id: result.insertId, ...warehouses };
	} catch (error) {
		logger.error(`Create warehouses failed: ${error.message}`, { data: warehouses, stack: error.stack });
		throw error;
	}
};

export const updateWarehouses = async (id, warehouses) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!warehouses || Object.keys(warehouses).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Warehouses.update(id, warehouses);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update warehouses failed: ${error.message}`, { id, data: warehouses, stack: error.stack });
		throw error;
	}
};

export const deleteWarehouses = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Warehouses.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete warehouses failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
