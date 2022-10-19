import { Request, Response, NextFunction } from 'express';

const NAMESPACE = 'Index';

const home = (req: Request, res: Response, next: NextFunction) => {
    res.render('index');
};

const dashboard = (req: Request, res: Response, next: NextFunction) => {
    res.render('dashboard');
};

const parseJwt = (token: any) => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

export default { home, dashboard };
