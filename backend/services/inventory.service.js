import Inventory from '../models/inventory.model.js';
import logger from '../common/logger.js';

export const getAllInventory = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Inventory.getAll({ limit, offset });
		const [countResult] = await Inventory.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all inventory failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getInventoryById = async (id) => {
	try {
		const [rows] = await Inventory.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get inventory by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createInventory = async (inventory) => {
	try {
		if (!inventory || Object.keys(inventory).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Inventory.insert(inventory);
		return { id: result.insertId, ...inventory };
	} catch (error) {
		logger.error(`Create inventory failed: ${error.message}`, { data: inventory, stack: error.stack });
		throw error;
	}
};

export const updateInventory = async (id, inventory) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!inventory || Object.keys(inventory).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Inventory.update(id, inventory);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update inventory failed: ${error.message}`, { id, data: inventory, stack: error.stack });
		throw error;
	}
};

export const deleteInventory = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Inventory.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete inventory failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
