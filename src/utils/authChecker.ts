import { AuthChecker } from "type-graphql";
import type { Context } from "../resolvers/types/Context";

export const authChecker : AuthChecker<Context> = ({ context }) : boolean => {
  if (!context.req?.userId) return false
  return true;
}