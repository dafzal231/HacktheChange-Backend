import { AuthChecker } from "type-graphql";
import type { Context } from "../resolvers/types/Context";
import jwt from "jsonwebtoken";

export const authChecker : AuthChecker<Context> = ({ context }) : boolean => {
  if (!context.req?.userId) return false
  return true;
}

export const createToken = ( payload : string | object | Buffer ) : string => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1 year"})
}