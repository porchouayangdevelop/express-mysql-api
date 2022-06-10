const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../../config/config').connect();

module.exports = {
    register: async (req, res) => {
        const {
            id,
            username,
            password,
            email,
            role
        } = req.body;
        const user = db.query(`SELECT * FROM users WHERE username = '${username}'`, (err, result) => {
            if (err) {
                res.status(500).json({
                    error: err,
                    message: 'Internal server error'

                });
            } else {
                if (result.length > 0) {
                    res.status(400).json({
                        message: 'Username already exists'
                    });
                } else {
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(password, salt);
                    db.query(`call post_user(?,?,?,?,?)`, [id, username, hash, email, role], (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.status(201).json({
                                message: 'User registered successfully',
                                data: result
                            });
                        }
                    });
                }
            }
        });
    },
    login: async (req, res) => {
        const {
            username,
            password
        } = req.body;
        const user = db.query(`SELECT * FROM users WHERE username = '${username}'`, (err, result) => {
            if (err) {
                res.status(500).json({
                    error: err,
                    message: 'Internal server error'
                });
            } else {
                if (result.length > 0) {
                    const user = result[0];
                    const isPasswordMatch = bcrypt.compareSync(password, user.password);
                    if (isPasswordMatch) {
                        const token = jwt.sign({
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            role: user.role
                        }, process.env.JWT_SECRET);
                        res.status(200).json({
                            message: 'Login successful',
                            data: {
                                token,
                                user
                            }
                        });
                    } else {
                        res.status(400).json({
                            message: 'Invalid username or password'
                        });
                    }
                } else {
                    res.status(400).json({
                        message: 'Invalid username or password'
                    });
                }
            }
        });
    },
    getUser: async (req, res) => {
        const {
            id
        } = req.params;
        const user = db.query(`SELECT * FROM users WHERE id = ${id}`, (err, result) => {
            if (err) {
                res.status(400).json({
                    message: 'Error getting user',
                    error: err
                });
            } else {
                res.status(200).json({
                    error: false,
                    message: 'User fetched successfully',
                    data: result
                });
            }
        });
    },
    getUsers: async (req, res) => {
        const users = db.query(`SELECT * FROM getAlls`, (err, result) => {
            if (err) {
                res.status(400).json({
                    message: 'Error fetching users',
                    error: err
                });
            } else {
                res.status(200).json({
                    message: 'Users fetched successfully',
                    data: result
                });
            }
        });
    },
    updateUser: async (req, res) => {
        const {
            id
        } = req.params;
        const {
            username,
            email,
            role
        } = req.body;
        const user = db.query(`SELECT * FROM users WHERE id = ${id}`, (err, result) => {
            if (err) {
                res.status(400).json({
                    message: 'User not found'
                })
            } else {
                if (result.length > 0) {
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(password, salt);
                    db.query(`call update_user(?,?,?,?,?)`, [username, hash, email, role, id], (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.status(200).json({
                                message: 'User updated successfully',
                                data: result
                            });
                        }
                    });
                } else {
                    res.status(400).json({
                        message: 'User not found'
                    });
                }
            }
        });
    },
    deleteUser: async (req, res) => {
        const {
            id
        } = req.params;
        const user = db.query(`SELECT * FROM users WHERE id = ${id}`, (err, result) => {
            if (err) {
                res.status(400).json({
                    message: 'User not found'
                });
            } else {
                if (result.length > 0) {
                    db.query(`call delete_user(?)`, [id], (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.status(200).json({
                                message: 'User deleted successfully',
                                data: result
                            });
                        }
                    });
                } else {
                    res.status(400).json({
                        message: 'User not found'
                    });
                }
            }
        });
    }
}