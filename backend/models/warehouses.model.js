import db from '../common/db.js';
import logger from '../common/logger.js';

class Warehouses {
	constructor(warehouses) {
		this.warehouse_id = warehouses.warehouse_id;
		this.warehouse_name = warehouses.warehouse_name;
		this.location = warehouses.location;
		this.created_at = warehouses.created_at;
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
		const sql = 'SELECT * FROM warehouses LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM warehouses';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM warehouses WHERE warehouse_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(warehouses) {
		const sql = 'INSERT INTO warehouses SET ?';
		return await this.query(sql, warehouses);
	}

	static async update(id, warehouses) {
		const sql = 'UPDATE warehouses SET ? WHERE warehouse_id = ?';
		return await this.query(sql, [warehouses, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM warehouses WHERE warehouse_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Warehouses;
