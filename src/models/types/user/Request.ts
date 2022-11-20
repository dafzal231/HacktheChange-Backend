import { Field, ID, ObjectType } from "type-graphql";
import { modelOptions, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class RequestType{
  @Field(type => ID)
  readonly _id: mongoose.Types.ObjectId

  @Field()
  readonly createdAt: Date

  @Field(type => ID)
  @prop({ required: true })
  fromId: string

  @Field(type => ID)
  @prop({ required: true })
  toId: string

  @Field()
  @prop({ required: true })
  accepted: boolean

  @Field({ nullable: true })
  @prop({ required: false })
  sessionId?: string
  
}