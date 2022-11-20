import { ArgsType, Field, InputType, ObjectType, ID } from "type-graphql";
import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";
import mongoose from "mongoose";

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class TagType{
  @Field(returns => ID)
  readonly _id: mongoose.Schema.Types.ObjectId;

  @Field()
  readonly createdAt: Date

  @Field()
  @prop({ required: true })
  name: string

  @Field()
  @prop({ required: true })
  level: number
  
  @Field()
  @prop({ required: true })
  type: string
}

@InputType()
export class TagInput implements Omit<TagType, "_id" | "createdAt">{
  @Field()
  name: string

  @Field()
  level: number
  
  @Field()
  type: string
}

@ArgsType()
export class TagsArgs{
  @Field(type => [TagInput])
  tags: TagInput[]
}


export const Tag = getModelForClass(TagType);

