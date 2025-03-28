import Products from '../models/products.model.js';
import logger from '../common/logger.js';

export const getAllProducts = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Products.getAll({ limit, offset });
		const [countResult] = await Products.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all products failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getProductsById = async (id) => {
	try {
		const [rows] = await Products.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get products by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createProducts = async (products) => {
	try {
		if (!products || Object.keys(products).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Products.insert(products);
		return { id: result.insertId, ...products };
	} catch (error) {
		logger.error(`Create products failed: ${error.message}`, { data: products, stack: error.stack });
		throw error;
	}
};

export const updateProducts = async (id, products) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!products || Object.keys(products).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Products.update(id, products);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update products failed: ${error.message}`, { id, data: products, stack: error.stack });
		throw error;
	}
};

export const deleteProducts = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Products.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete products failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
