import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {AddUser, User, UserType} from "../models/user";
import jwt from 'jsonwebtoken';
import {AuthPayload} from "./dto/AuthPayload";

@Resolver()
export class UserResolver {
    @Query(returns => String)
    async getUser() {
        return "hi";
    }

    @Mutation(returns => AuthPayload)
    async addUser(@Arg('data') data: AddUser) {
        const existingUser = await User.findOne({email: data.email});

        if (existingUser) {
            throw Error("User already exist with this email");
        }

        const user = new User(data);
        await user.save();
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1 year"});

        return new AuthPayload(token);
    }

    @Query(returns => [UserType])
    async getUsers() {
        return User.find();
    }
}
