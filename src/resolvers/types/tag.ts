import { Field, ObjectType } from "type-graphql";
import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class TagType{
  @Field()
  name: string

  @Field()
  level: number
  
  @Field()
  type: string
}

export const Tag = getModelForClass(TagType);

