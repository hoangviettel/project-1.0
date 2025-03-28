import Shipping_methods from '../models/shipping_methods.model.js';
import logger from '../common/logger.js';

export const getAllShipping_methods = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Shipping_methods.getAll({ limit, offset });
		const [countResult] = await Shipping_methods.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all shipping_methods failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getShipping_methodsById = async (id) => {
	try {
		const [rows] = await Shipping_methods.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get shipping_methods by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createShipping_methods = async (shipping_methods) => {
	try {
		if (!shipping_methods || Object.keys(shipping_methods).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Shipping_methods.insert(shipping_methods);
		return { id: result.insertId, ...shipping_methods };
	} catch (error) {
		logger.error(`Create shipping_methods failed: ${error.message}`, { data: shipping_methods, stack: error.stack });
		throw error;
	}
};

export const updateShipping_methods = async (id, shipping_methods) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!shipping_methods || Object.keys(shipping_methods).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Shipping_methods.update(id, shipping_methods);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update shipping_methods failed: ${error.message}`, { id, data: shipping_methods, stack: error.stack });
		throw error;
	}
};

export const deleteShipping_methods = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Shipping_methods.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete shipping_methods failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
