import {buildSchema} from "type-graphql";
import {UserResolver} from "./UserResolver";
import {AuthPayload} from "./types/AuthPayload";

export const schema = buildSchema({
    resolvers: [
        UserResolver,
    ]
})
