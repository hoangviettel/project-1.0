import Categories from '../models/categories.model.js';
import logger from '../common/logger.js';

export const getAllCategories = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Categories.getAll({ limit, offset });
		const [countResult] = await Categories.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all categories failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getCategoriesById = async (id) => {
	try {
		const [rows] = await Categories.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get categories by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createCategories = async (categories) => {
	try {
		if (!categories || Object.keys(categories).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Categories.insert(categories);
		return { id: result.insertId, ...categories };
	} catch (error) {
		logger.error(`Create categories failed: ${error.message}`, { data: categories, stack: error.stack });
		throw error;
	}
};

export const updateCategories = async (id, categories) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!categories || Object.keys(categories).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Categories.update(id, categories);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update categories failed: ${error.message}`, { id, data: categories, stack: error.stack });
		throw error;
	}
};

export const deleteCategories = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Categories.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete categories failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
