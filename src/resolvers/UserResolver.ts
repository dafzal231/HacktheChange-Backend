import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver, Int } from "type-graphql";
import { AddUser, User, UserType } from "../models/user";
import jwt from 'jsonwebtoken';
import { AuthPayload } from "./types/AuthPayload";
import { Context } from "./types/Context";
import { TagType, TagInput, TagsArgs } from "../models/tag";
import { createToken } from "../utils/auth";

@Resolver()
export class UserResolver {
    @Authorized()
    @Query(returns => UserType)
    async getUser(@Ctx() context: Context) {
        const { userId } = context.req;
        const user = await User.findById(userId);

        return user;
    }

    @Mutation(returns => AuthPayload)
    async addUser(@Arg('data') data: AddUser) {
        const existingUser = await User.findOne({email: data.email});

        if (existingUser) {
            throw Error("User already exist with this email");
        }

        // TODO: encrypt password before saving.

        const user = new User(data);
        await user.save();
        const token = createToken({ id: user._id });

        return new AuthPayload(token);
    }

    
    @Query(type => AuthPayload)
    async loginUser(@Arg('email') email: string, @Arg('password') password: string) {
        const user = await User.findOne({email, password});

        if (!user) {
            throw Error("Invalid email or password");
        }

        const token = createToken({ id: user._id });

        return new AuthPayload(token);
    }

    @Authorized()
    @Mutation(type => AuthPayload)
    async addTags(
        @Ctx() context: Context,
        @Args() { tags } : TagsArgs
    ){
        // console.log(tags);
        const { userId } = context.req;

        const user = await User.findById(userId);

        user.tags.push(...tags);
        await user.save();
        
        const token = createToken({ id: userId })

        return new AuthPayload(token);
    }

    /*
    * Adds the value to the current credits i.e. negative value will decrease credits, positive value will increase credits.
    */
    @Authorized()
    @Mutation(type => AuthPayload)
    async updateCredits(
        @Arg("value", type => Int) value: number,
        @Ctx() ctx: Context
    ){
        const { userId } = ctx.req;

        const user = await User.findById(userId);
        if (user.credits === undefined){
            user.credits = value;
        } else {
            user.credits += value;
        }
        await user.save();

        const token = createToken({ id: userId });
        return new AuthPayload(token);
    }

    /*
    * Adds the value to the current reputation i.e. negative value will decrease credits, positive value will increase credits.
    */
    @Authorized()
    @Mutation(type => AuthPayload)
    async updateReputation(
        @Arg("value", type => Int) value: number,
        @Ctx() ctx: Context
    ){
        const { userId } = ctx.req;

        const user = await User.findById(userId);
        if (user.reputation === undefined){
            user.reputation = value;
        } else {
            user.reputation += value;
        }
        await user.save();

        const token = createToken({ id: userId });
        return new AuthPayload(token);
    }

    @Authorized()
    @Query(returns => [UserType])
    async getUsers(@Ctx() context: Context) {
        return User.find();
    }
}
