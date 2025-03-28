import Cart_items from '../models/cart_items.model.js';
import logger from '../common/logger.js';

export const getAllCart_items = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Cart_items.getAll({ limit, offset });
		const [countResult] = await Cart_items.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all cart_items failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getCart_itemsById = async (id) => {
	try {
		const [rows] = await Cart_items.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get cart_items by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createCart_items = async (cart_items) => {
	try {
		if (!cart_items || Object.keys(cart_items).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Cart_items.insert(cart_items);
		return { id: result.insertId, ...cart_items };
	} catch (error) {
		logger.error(`Create cart_items failed: ${error.message}`, { data: cart_items, stack: error.stack });
		throw error;
	}
};

export const updateCart_items = async (id, cart_items) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!cart_items || Object.keys(cart_items).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Cart_items.update(id, cart_items);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update cart_items failed: ${error.message}`, { id, data: cart_items, stack: error.stack });
		throw error;
	}
};

export const deleteCart_items = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Cart_items.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete cart_items failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
