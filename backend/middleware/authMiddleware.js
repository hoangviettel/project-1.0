import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import csrf from 'csurf';
import db from '../common/db.js';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import logger from '../common/logger.js';

const SECRET_KEY = process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET is required'); })();
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || (() => { throw new Error('JWT_REFRESH_SECRET is required'); })();
passport.use(new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: SECRET_KEY
}, async (jwtPayload, done) => {
	try {
		const [users] = await db.query('SELECT * FROM users WHERE account_id = ?', [jwtPayload.id]);
		if (users.length > 0) return done(null, users[0]);
		return done(null, false);
	} catch (error) {
		logger.error(`JWT verify error: ${error.message}`, { stack: error.stack });
		return done(error);
	}
}));
const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};
export const csrfProtection = csrf({ cookie: true });
export const authenticateJWT = passport.authenticate('jwt', { session: false });
export const restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
		if (!roles.includes(req.user.role)) {
			logger.warn(`Access denied for role ${req.user.role} by ${req.user.email}`);
			return res.status(403).json({ message: `Access denied. Required roles: ${roles.join(', ')}` });
		}
		next();
	};
};
export const register = [
	body('email').isEmail().withMessage('Invalid email'),
	body('username').notEmpty().withMessage('Username is required'),
	body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
	body('role').isIn(['admin', 'staff']).withMessage('Role must be admin or staff'),
	validate,
	async (req, res) => {
		const { email, username, password, role } = req.body;
		try {
			const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
			if (existingUsers.length > 0) {
				logger.warn(`Registration attempt with existing email or username: ${email}, ${username}`);
				return res.status(409).json({ message: 'Email or username already exists' });
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			const [result] = await db.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, role]);
			logger.info(`User registered successfully: ${username}, ${email}`);
			res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
		} catch (error) {
			logger.error(`Registration error: ${error.message}`, { email, username, stack: error.stack });
			if (error.code === 'ER_ACCESS_DENIED_ERROR') return res.status(500).json({ message: 'Database connection failed' });
			if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Email or username already exists' });
			res.status(500).json({ message: `Registration error: ${error.message}` });
		}
	}
];
export const login = [
	body('email').isEmail().withMessage('Invalid email'),
	body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
	validate,
	async (req, res) => {
		const { email, password } = req.body;
		try {
			const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
			if (users.length === 0 || !await bcrypt.compare(password, users[0].password_hash)) {
				logger.warn(`Login failed: Invalid credentials for ${email}`);
				return res.status(401).json({ message: 'Invalid email or password' });
			}
			const user = users[0];
			const accessToken = jwt.sign({ id: user.account_id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
			const refreshToken = jwt.sign({ id: user.account_id }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
			await db.query('INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?) ON DUPLICATE KEY UPDATE token = ?', [user.account_id, refreshToken, refreshToken]);
			res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
			logger.info(`User logged in successfully: ${email}`);
			res.status(200).json({ accessToken, user: { id: user.account_id, email: user.email, role: user.role }, csrfToken: req.csrfToken() });
		} catch (error) {
			logger.error(`Login error: ${error.message}`, { email, stack: error.stack });
			if (error.code === 'ER_ACCESS_DENIED_ERROR') return res.status(500).json({ message: 'Database connection failed' });
			if (error.name === 'SyntaxError') return res.status(400).json({ message: 'Invalid data format' });
			res.status(500).json({ message: `Login error: ${error.message}` });
		}
	}
];
export const refreshToken = async (req, res) => {
	const refreshToken = req.cookies.refreshToken;
	try {
		if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required' });
		const [tokens] = await db.query('SELECT * FROM refresh_tokens WHERE token = ?', [refreshToken]);
		if (tokens.length === 0) return res.status(403).json({ message: 'Invalid refresh token' });
		const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
		const [users] = await db.query('SELECT * FROM users WHERE account_id = ?', [decoded.id]);
		if (users.length === 0) return res.status(404).json({ message: 'User not found' });
		const user = users[0];
		const accessToken = jwt.sign({ id: user.account_id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
		logger.info(`Token refreshed for user: ${user.email}`);
		res.status(200).json({ accessToken });
	} catch (error) {
		logger.error(`Refresh token error: ${error.message}`, { stack: error.stack });
		if (error.name === 'TokenExpiredError') return res.status(403).json({ message: 'Refresh token expired' });
		res.status(403).json({ message: 'Invalid refresh token' });
	}
};
export const logout = async (req, res) => {
	const refreshToken = req.cookies.refreshToken;
	try {
		if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required' });
		await db.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
		res.clearCookie('refreshToken');
		logger.info(`User logged out successfully`);
		res.status(200).json({ message: 'Logged out successfully' });
	} catch (error) {
		logger.error(`Logout error: ${error.message}`, { stack: error.stack });
		res.status(500).json({ message: `Logout error: ${error.message}` });
	}
};
export const verifyAdmin = [authenticateJWT, restrictTo('admin')];
