import type {Request , Response , NextFunction, RequestHandler} from "express";


export const AsyncHandler = <
 P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = {}
>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction
  ) => Promise<any>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};