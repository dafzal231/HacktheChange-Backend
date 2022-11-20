import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver, Int } from "type-graphql";
import { AddUser, User, UserType } from "../models/user";
import { AuthPayload } from "./types/AuthPayload";
import { Context } from "./types/Context";
import { TagsArgs, Tag } from "../models/types/user/Tag";
import { createToken } from "../utils/auth";
import { Session } from "../models/session";

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

    
    @Mutation(type => AuthPayload)
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

        for (let i = 0; i < tags.length; i++){
            const tag = tags[i];
            const existing = Tag.findOne({ name: tag.name });
            if (!existing) continue;
            await Tag.create(tag);
        }

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
    @Mutation(type => AuthPayload)
    async makeRequest(
        @Ctx() ctx: Context,
        @Arg('toUserId') toUserId: string
    ){

        const { userId } = ctx.req;

        const toUser = await User.findById(toUserId);
        const user = await User.findById(userId);

        
        const request = {
            fromId: userId,
            toId: toUserId,
            accepted: false
        }

        toUser.requests.push(request);
        user.requests.push(request);
        

        await toUser.save();
        await user.save();

        const token = createToken({ id: userId });

        return new AuthPayload(token)
    }

    @Authorized()
    @Mutation(type => AuthPayload)
    async confirmRequest(
        @Ctx() ctx: Context,
        @Arg("fromId") fromId: string,
        @Arg("confirmation") confirmation: boolean
    ){

        const { userId } = ctx.req;
        const user = await User.findById(userId);
        const fromUser = await User.findById(fromId);

        if (!fromUser){
            throw Error("Not found!")
        }

        // Find request to me
        const fromRequestIdx = fromUser.requests.findIndex( req => req.toId === userId );
        if (fromRequestIdx === -1){
            throw Error("no request")
        }

        // Request in my requests
        const userRequestIdx = user.requests.findIndex( req => req.toId === userId )
        
        user.requests[userRequestIdx].accepted = confirmation;
        fromUser.requests[fromRequestIdx].accepted = confirmation;

        

        if (confirmation){
            const sessionObj = {
                ids: [user._id.toString(), fromUser._id.toString()]
            }
    
            const session = await Session.create(sessionObj);

            user.requests[userRequestIdx].sessionId = session._id.toString();
            fromUser.requests[fromRequestIdx].sessionId = session._id.toString();
        }

        await user.save()
        await fromUser.save();

        const token = createToken({ id: userId });

        return new AuthPayload(token);

    }

    @Authorized()
    @Query(returns => [UserType])
    async getUsers(@Ctx() context: Context) {
        return User.find();
    }
}
