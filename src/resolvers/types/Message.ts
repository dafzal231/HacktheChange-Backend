import mongoose from "mongoose";
import {Field, ObjectType, ID} from "type-graphql";

@ObjectType()
export class MessageType{

    @Field(returns => Date)
    readonly createdAt: Date;

    @Field()
    message: string

    @Field(returns => ID)
    readonly _id: mongoose.Schema.Types.ObjectId;    
}