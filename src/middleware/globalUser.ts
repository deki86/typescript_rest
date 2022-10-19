import { Request, Response, NextFunction } from 'express';
import jwtDecode from 'jwt-decode';

const globalUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies.jwt) {
        const userData = jwtDecode(req.cookies.jwt);
        res.locals.user = userData;
    } else {
        res.locals.user = '';
    }
    next();
};

export default globalUser;
