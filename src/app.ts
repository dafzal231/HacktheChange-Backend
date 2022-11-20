import {ApolloServer} from "@apollo/server";

require('dotenv').config()
import "reflect-metadata";
import express, {json, NextFunction, Request, Response} from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import {schema} from "./resolvers";
import {expressMiddleware} from "@apollo/server/express4";

const app = express();
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.umlnwy0.mongodb.net/?retryWrites=true&w=majority`

const init = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log('successfully connected to db');

        app.use(bodyParser.json())
        app.use(cors());

        const server = new ApolloServer({
            schema: await schema,
            formatError: (err) => {

                // @ts-ignore
                console.error(err.extensions);

                return err;
            },
        });

        await server.start();

        app.use(
            "/graphql",
            cors<cors.CorsRequest>(),
            bodyParser.json(),
            expressMiddleware(server)
        );
    } catch (e) {
        console.log('Failed to connect with mongo instance', e.message);
    }
}


init();


app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
