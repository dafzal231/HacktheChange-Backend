import {Field, ID, InputType, ObjectType} from "type-graphql";
import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import mongoose from "mongoose";

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
    @prop({required: false, minlength: 6, maxlength: 16, match: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]$/})
    password: string;

    @Field()
    readonly createdAt: Date;
}

export const User = getModelForClass(UserType);

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
