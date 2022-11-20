import {Field, ObjectType} from "type-graphql";

@ObjectType()
export class AuthPayload{
    @Field()
    token:string;

    constructor(token: string) {
        this.token = token;
    }
}
