import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {AddUser, User, UserType} from "../models/user";
import jwt from 'jsonwebtoken';
import {AuthPayload} from "./types/AuthPayload";
import {Context} from "./types/Context";

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

    @Query(type => AuthPayload)
    async loginUser(@Arg('email') email: string, @Arg('password') password: string) {
        const user = await User.findOne({email, password});

        if (!user) {
            throw Error("Invalid email or password");
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1 year"});

        return new AuthPayload(token);
    }


    /**
     * when we pass "Authorization" header with the token then we can access the userid from the context as shown below
     * @param context
     */
    @Query(returns => [UserType])
    async getUsers(@Ctx() context: Context) {
        if (!context.req?.userId) {
            throw Error("Unauthorized");
        }

        return User.find();
    }
}
