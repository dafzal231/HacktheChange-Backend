import {buildSchema} from "type-graphql";
import {UserResolver} from "./UserResolver";
import {AuthPayload} from "./types/AuthPayload";
import { authChecker } from "../utils/auth";

export const schema = buildSchema({
    resolvers: [
        UserResolver,
    ],
    authChecker
})
