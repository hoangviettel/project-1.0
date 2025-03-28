import db from '../common/db.js';
import logger from '../common/logger.js';

class Refresh_tokens {
	constructor(refresh_tokens) {
		this.user_id = refresh_tokens.user_id;
		this.token = refresh_tokens.token;
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
		const sql = 'SELECT * FROM refresh_tokens LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM refresh_tokens';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM refresh_tokens WHERE user_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(refresh_tokens) {
		const sql = 'INSERT INTO refresh_tokens SET ?';
		return await this.query(sql, refresh_tokens);
	}

	static async update(id, refresh_tokens) {
		const sql = 'UPDATE refresh_tokens SET ? WHERE user_id = ?';
		return await this.query(sql, [refresh_tokens, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM refresh_tokens WHERE user_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Refresh_tokens;
