import {buildSchema} from "type-graphql";
import {UserResolver} from "./UserResolver";

export const schema = buildSchema({
    resolvers: [
        UserResolver
    ]
})
