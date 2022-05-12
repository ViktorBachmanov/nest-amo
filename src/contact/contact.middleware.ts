import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ContactMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    req.query.add = 'Доп. параметр';

    // res.writeHead(200, { 'content-type': 'application/json' });
    // res.write(JSON.stringify({ test: 'end response' }));
    // res.end();

    next();
  }
}
