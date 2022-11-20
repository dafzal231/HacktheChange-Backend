import {buildSchema} from "type-graphql";
import {UserResolver} from "./UserResolver";
import {SessionResolver} from "./SessionResolver";
import {AuthPayload} from "./types/AuthPayload";
import { authChecker } from "../utils/auth";
import { ExploreResolver } from "./ExploreResolver";

export const schema = buildSchema({
    resolvers: [
        UserResolver,
        SessionResolver,
        ExploreResolver
    ],
    authChecker
})
