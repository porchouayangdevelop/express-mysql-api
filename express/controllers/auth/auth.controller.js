const db = require('../../config/config').connect();

module.exports = {

    created: async (req, res) => {
        const {
            firstname,
            lastname,
            gender,
            phone,
            address,
            saraly
        } = req.body;
        (firstname == "" || gender == "") ? res.status(400).json({
                message: 'required'
            }):
            await db.query(`call post_auth_user(?,?,?,?,?,?)`, [firstname, lastname, gender, phone, address, saraly], (err, result) => {
                if (err) {
                    res.status(400).json({
                        err: err,
                        message: 'Auth created failed'
                    });
                } else {
                    res.status(201).json({
                        message: 'Auth created successfully',
                        data: result
                    });
                }
            })
    },
    getAlls: async (req, res) => {
        await db.query(`SELECT *FROM auth_user`, (err, result) => {
            if (err) {
                res.status(400).json({
                    error: err,
                    message: 'bad request'
                });
            } else {
                res.status(200).json({
                    message: 'Auth Fetched successfully',
                    data: result
                });
            }
        });
    },
    getOne: async (req, res) => {
        const {
            id
        } = req.params;
        await db.query(`SELECT *FROM auth_user WHERE id =?`, [id], (err, result) => {
            if (err) {
                res.status(400).json({
                    error: err,
                    message: 'bad request'
                });
            } else {
                res.status(200).json({
                    message: 'Auth Fetched successfully',
                    data: result
                });
            }
        });
    }, // end getOne

    update: async (req, res) => {
        const {
            id
        } = req.params;
        const {
            firstname,
            lastname,
            gender,
            phone,
            address,
            saraly
        } = req.body;
        await db.query(`select *from auth_user where id = ${id}`, (err, result) => {
            if (err) {
                res.status(404).json({
                    error: err,
                    message: 'auth not found'
                });
            } else {
                if (result.length > 0) {
                    db.query(`call update_auth_user(?,?,?,?,?,?,?)`, [firstname, lastname, gender, phone, address, saraly, id], (err, data) => {
                        if (err) {
                            res.status(400).json({
                                message: ''
                            })
                        } else {
                            res.status(200).json({
                                message: 'Auth updated successfully',
                                data: data
                            });
                        }
                    })
                } else {
                    res.status(404).json({
                        message: 'auth not found'
                    });
                }
            }
        })
    }, // end of update

    delete: async (req, res) => {
        const {
            id
        } = req.params;
        await db.query(`select *from auth_user where id = ${id}`, (err, result) => {
            if (err) {
                res.status(404).json({
                    error: err,
                    message: 'auth not found'
                });
            } else {
                if (result.length > 0) {
                    db.query(`call delete_auth_user(?)`, [id], (err, data) => {
                        if (err) {
                            res.status(400).json({
                                message: ''
                            })
                        } else {
                            res.status(200).json({
                                message: 'Auth deleted successfully',
                                data: data
                            });
                        }
                    })
                } else {
                    res.status(404).json({
                        message: 'auth not found'
                    });
                }
            }
        })
    } // end of delete


}