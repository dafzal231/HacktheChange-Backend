import {Field, ID, InputType, ObjectType} from "type-graphql";
import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import mongoose from "mongoose";

/**
 * From this two decorations we can generate the graphql schema and the mongoose schema with single class!
 * For more refer to typegoose docs and type-graphql docs
 */
@ObjectType()
@modelOptions({
    schemaOptions: {timestamps: true},
})
export class UserType {
    @Field(returns => ID)
    readonly _id: mongoose.Schema.Types.ObjectId;

    @Field()
    @prop({required: true})
    firstName: string;

    @Field()
    @prop({required: true})
    lastName: string;

    @Field()
    @prop({required: true})
    userName: string;

    @Field()
    @prop({validate: /\S+@\S+\.\S+/, unique: true, required: true})
    email: string;

    @Field({nullable: true})
    @prop({required: false, minlength: 6})
    password: string;

    @Field()
    readonly createdAt: Date;
}

export const User = getModelForClass(UserType);

/**
 * When we want to create a new user we don't have _id or createdAt so we need to create this input type
 */
@InputType()
export class AddUser implements UserType {
    readonly _id: mongoose.Schema.Types.ObjectId;
    readonly createdAt: Date;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    userName: string;

    @Field()
    email: string;

    @Field({nullable: true})
    password: string;
}
