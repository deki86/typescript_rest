import { Request, Response, NextFunction } from 'express';

import User from '../models/user';

const NAMESPACE = 'User';

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select('-password')
        .exec()
        .then((users) => {
            if (users.length === 0) {
                return res.status(200).json({
                    message: 'No users in database'
                });
            }
            return res.status(200).json({
                users,
                count: users.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getOneUser = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    User.findById(id)
        .select('-password')
        .exec()
        .then((user) => {
            return res.status(200).json({
                user
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { getAllUsers, getOneUser };
