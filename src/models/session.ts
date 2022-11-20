import {Field, ID, InputType, ObjectType} from "type-graphql";
import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import { MessageType } from "../resolvers/types/Message"
import mongoose, { ObjectId } from "mongoose";


/**
 * From this two decorations we can generate the graphql schema and the mongoose schema with single class!
 * For more refer to typegoose docs and type-graphql docs
 */

 @ObjectType()
 export class SessionType{
 
     @Field(returns => [MessageType], {nullable: true })
     @prop({ required: true, type: MessageType, default: []})
     messages: mongoose.Types.Array<MessageType>
 
     @Field(returns => [ID])
     @prop({ required: true })
     readonly _ids: mongoose.Types.Array<ObjectId>
 }

export const Session = getModelForClass(SessionType);

/**
 * When we want to create a new user we don't have _id or createdAt so we need to create this input type
 */

type SessionTypeOmit = "messages"

 /**
  * When we want to create a new user we don't have _id or createdAt so we need to create this input type
  */
 @InputType()
 export class AddSession implements Omit<SessionType, SessionTypeOmit> {

    @Field(returns => ID)
    readonly _ids: mongoose.Types.Array<ObjectId>
}


