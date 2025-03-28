import Carts from '../models/carts.model.js';
import logger from '../common/logger.js';

export const getAllCarts = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Carts.getAll({ limit, offset });
		const [countResult] = await Carts.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all carts failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getCartsById = async (id) => {
	try {
		const [rows] = await Carts.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get carts by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createCarts = async (carts) => {
	try {
		if (!carts || Object.keys(carts).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Carts.insert(carts);
		return { id: result.insertId, ...carts };
	} catch (error) {
		logger.error(`Create carts failed: ${error.message}`, { data: carts, stack: error.stack });
		throw error;
	}
};

export const updateCarts = async (id, carts) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!carts || Object.keys(carts).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Carts.update(id, carts);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update carts failed: ${error.message}`, { id, data: carts, stack: error.stack });
		throw error;
	}
};

export const deleteCarts = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Carts.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete carts failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
