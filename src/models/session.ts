import {Field, ID, InputType, ObjectType} from "type-graphql";
import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import { MessageType } from "./types/session/Message"
import mongoose, { ObjectId } from "mongoose";


/**
 * From this two decorations we can generate the graphql schema and the mongoose schema with single class!
 * For more refer to typegoose docs and type-graphql docs
 */

 @ObjectType()
 @modelOptions({
    schemaOptions: { 
        timestamps: true,
        collection: "sessions"
    }
 })
 export class SessionType{
    @Field(type => ID)
    readonly _id: mongoose.Types.ObjectId
    @Field()
    readonly createdAt: Date

    @Field(returns => [MessageType], {nullable: true })
    @prop({ required: true, type: MessageType, default: []})
    messages: mongoose.Types.Array<MessageType>
 
    @Field(returns => [ID])
    @prop({ required: true, type: String, default: []})
    ids: mongoose.Types.Array<string>
 }

export const Session = getModelForClass(SessionType);




