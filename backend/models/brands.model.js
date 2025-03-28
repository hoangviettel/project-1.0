import db from '../common/db.js';
import logger from '../common/logger.js';

class Brands {
	constructor(brands) {
		this.brand_id = brands.brand_id;
		this.brand_name = brands.brand_name;
		this.created_at = brands.created_at;
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
		const sql = 'SELECT * FROM brands LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM brands';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM brands WHERE brand_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(brands) {
		const sql = 'INSERT INTO brands SET ?';
		return await this.query(sql, brands);
	}

	static async update(id, brands) {
		const sql = 'UPDATE brands SET ? WHERE brand_id = ?';
		return await this.query(sql, [brands, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM brands WHERE brand_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Brands;
