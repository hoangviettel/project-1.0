import db from '../common/db.js';
import logger from '../common/logger.js';

class Product_images {
	constructor(product_images) {
		this.image_id = product_images.image_id;
		this.product_id = product_images.product_id;
		this.image_url = product_images.image_url;
		this.is_primary = product_images.is_primary;
		this.created_at = product_images.created_at;
	}

	static async query(sql, params) {
		try {{
			return await db.query(sql, params);
		}} catch (error) {
			logger.error(`Database query error: ${error.message}`, { sql, params, stack: error.stack });
			throw new Error(`Database error: ${error.message}`);
		}
	}

	static async getAll({ limit = 10, offset = 0 } = {}) {
		const sql = 'SELECT * FROM product_images LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM product_images';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM product_images WHERE image_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(product_images) {
		const sql = 'INSERT INTO product_images SET ?';
		return await this.query(sql, product_images);
	}

	static async update(id, product_images) {
		const sql = 'UPDATE product_images SET ? WHERE image_id = ?';
		return await this.query(sql, [product_images, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM product_images WHERE image_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Product_images;
