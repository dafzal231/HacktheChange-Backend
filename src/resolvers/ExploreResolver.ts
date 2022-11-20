import {Arg, Ctx, Authorized, Mutation, Query, Resolver} from "type-graphql";
import {Session, SessionType} from "../models/session";
import { User, UserType } from "../models/user";
import { TagType, Tag} from "../models/types/user/Tag";
import jwt from 'jsonwebtoken';
import {AuthPayload} from "./types/AuthPayload";
import {Context} from "./types/Context";

@Resolver()
export class ExploreResolver {

    @Authorized()
    @Query(type => [UserType])
    async getAllUsers() {

        const users = await User.find()
        return users;
    }

    @Authorized()
    @Query(type => [TagType])
    async getAllTags() {

        const tags = await Tag.find()
        return tags;
    }
}
