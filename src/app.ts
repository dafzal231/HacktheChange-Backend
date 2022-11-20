import {ApolloServer} from "apollo-server-express";

require('dotenv').config()
import "reflect-metadata";
import express, {json, NextFunction, Request, Response} from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import {schema} from "./resolvers";
import {Context, CustomRequest} from "./resolvers/types/Context";
import {verify} from "jsonwebtoken";

const app = express();
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.umlnwy0.mongodb.net/?retryWrites=true&w=majority`

export interface JWTUserPayload {
    id: String
}

const init = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log('successfully connected to db');

        app.use(bodyParser.json())
        app.use(cors());

        /**
         * When "Authorization" header is present, it will parse user id from the token and add it to the context
         * so we can use it in resolvers (see UserResolver.ts for more)
         */
        app.use("/graphql", async (req: CustomRequest, res: Response, next: NextFunction) => {
            const token = req.headers.authorization;
            if (token) {
                try {
                    const user = await <JWTUserPayload>verify(token, process.env.JWT_SECRET);
                    req.userId = user.id;
                    // console.log('user id', user.id);
                } catch (e) {
                    // ignoring
                }
            }
            next();
        });

        const server = new ApolloServer({
            schema: await schema,
            context: ({req, res}: Context) => ({req, res}),
            formatError: (err) => {
                // @ts-ignore
                console.error(err.extensions);
                return err;
            },
        });

        await server.start()

        server.applyMiddleware({app});

    } catch (e) {
        console.log('Failed to connect with mongo instance', e.message);
    }
}


init();

const PORT = process.env.PORT || 8080

app.listen(PORT, function () {
    console.log('Example app listening on port 3000!')
})
