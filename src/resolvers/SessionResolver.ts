import {Arg, Ctx, Authorized, Mutation, Query, Resolver} from "type-graphql";
import {AddSession, Session, SessionType} from "../models/session";
import jwt from 'jsonwebtoken';
import {AuthPayload} from "./types/AuthPayload";
import {Context} from "./types/Context";

@Resolver()
export class SessionResolver {

    @Authorized()
    @Mutation(returns => AuthPayload)
    async addMessage(@Arg("content") content: string, @Ctx() context: Context, @Arg("sid") sessionid: string) {

        const session = await Session.findById(sessionid)

        const message = {
            createdAt: new Date(),
            message: content,
            _id: context.req.userId
          }
        
        session.messages.push(message)
        await session.save()

        const token = jwt.sign({id: context.req.userId}, process.env.JWT_SECRET, {expiresIn: "1 year"});

        return new AuthPayload(token);
    }

    @Authorized()
    @Query(type => [SessionType])
    async getSession(@Arg('sid') sessionid: string, @Ctx() context: Context) {
        const session = await Session.findById(sessionid)

        return session;
    }

    /**
     * when we pass "Authorization" header with the token then we can access the userid from the context as shown below
     * @param context
     */
    @Query(returns => [SessionType])
    async getUsers(@Ctx() context: Context) {
        if (!context.req?.userId) {
            throw Error("Unauthorized");
        }

        return Session.find();
    }
}
