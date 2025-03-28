import Brands from '../models/brands.model.js';
import logger from '../common/logger.js';

export const getAllBrands = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Brands.getAll({ limit, offset });
		const [countResult] = await Brands.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all brands failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getBrandsById = async (id) => {
	try {
		const [rows] = await Brands.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get brands by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createBrands = async (brands) => {
	try {
		if (!brands || Object.keys(brands).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Brands.insert(brands);
		return { id: result.insertId, ...brands };
	} catch (error) {
		logger.error(`Create brands failed: ${error.message}`, { data: brands, stack: error.stack });
		throw error;
	}
};

export const updateBrands = async (id, brands) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!brands || Object.keys(brands).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Brands.update(id, brands);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update brands failed: ${error.message}`, { id, data: brands, stack: error.stack });
		throw error;
	}
};

export const deleteBrands = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Brands.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete brands failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
