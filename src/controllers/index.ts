import { Request, Response, NextFunction } from 'express';

const NAMESPACE = 'Index';

const home = (req: Request, res: Response, next: NextFunction) => {
    // logging.info(NAMESPACE, 'Token validated, user authorized');

    // return res.status(200).json({
    //     message: 'Authorized'
    // });

    res.render('index');
};

export default { home };
