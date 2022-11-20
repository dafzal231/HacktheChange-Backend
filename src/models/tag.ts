import { Field, ObjectType } from "type-graphql";
import { modelOptions } from "@typegoose/typegoose";

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


