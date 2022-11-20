import {Request, Response} from "express";
import {UserType} from "../../models/User";

export interface MyRequest extends Request {
    adminUser?: UserType,
    userId?: String
}

/**
 * Returns express request and response to the query
 */
export interface Context {
    req: MyRequest,
    res: Response
}
