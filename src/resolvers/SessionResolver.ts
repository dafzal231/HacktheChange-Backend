import {Arg, Ctx, Authorized, Mutation, Query, Resolver} from "type-graphql";
import { Session, SessionType} from "../models/session";
import jwt from 'jsonwebtoken';
import {AuthPayload} from "./types/AuthPayload";
import {Context} from "./types/Context";

@Resolver()
export class SessionResolver {

    @Authorized()
    @Mutation(type => AuthPayload)
    async addMessage(@Arg("content") content: string, @Ctx() context: Context, @Arg("sid") sessionid: string) {

        const { userId } = context.req;
        
        const session = await Session.findById(sessionid)
        
        session.messages.push({ message: content, fromId: userId })
        await session.save()

        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {expiresIn: "1 year"});

        return new AuthPayload(token);
    }

    @Authorized()
    @Query(type => SessionType)
    async getSession(@Arg('sid') sessionid: string, @Ctx() context: Context) {
        const session = await Session.findById(sessionid)

        if (!session){
            throw Error("Not found!")
        }

        return session;
    }
}
