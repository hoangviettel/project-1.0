import Product_images from '../models/product_images.model.js';
import logger from '../common/logger.js';

export const getAllProduct_images = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Product_images.getAll({ limit, offset });
		const [countResult] = await Product_images.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all product_images failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getProduct_imagesById = async (id) => {
	try {
		const [rows] = await Product_images.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get product_images by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createProduct_images = async (product_images) => {
	try {
		if (!product_images || Object.keys(product_images).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Product_images.insert(product_images);
		return { id: result.insertId, ...product_images };
	} catch (error) {
		logger.error(`Create product_images failed: ${error.message}`, { data: product_images, stack: error.stack });
		throw error;
	}
};

export const updateProduct_images = async (id, product_images) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!product_images || Object.keys(product_images).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Product_images.update(id, product_images);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update product_images failed: ${error.message}`, { id, data: product_images, stack: error.stack });
		throw error;
	}
};

export const deleteProduct_images = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Product_images.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete product_images failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
