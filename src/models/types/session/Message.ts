import mongoose from "mongoose";
import {Field, ObjectType, ID} from "type-graphql";
import { prop, modelOptions } from "@typegoose/typegoose"

@ObjectType()
@modelOptions({
    schemaOptions: { timestamps: true }
})
export class MessageType{

    @Field()
    readonly createdAt: Date;
    @Field(returns => ID)
    readonly _id: mongoose.Types.ObjectId;   

    @Field()
    @prop({ required: true })
    message: string

    @Field()
    @prop({ required: true })
    fromId: string

     
}