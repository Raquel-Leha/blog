import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from 'cors';
import http from 'http';



export async function startApolloServer(posts) {
    //Servidor de express
    const app = express();
  
    const httpServer = http.createServer(app);

    app.get("/", (req,res) => res.send("Bienvenido a mi API"))

    //Servidor de Graphql
    const server = new ApolloServer({
      posts,
    });
  
    await server.start();
  
    app.use("/graphql", cors(), express.json(), expressMiddleware(server));

    await new Promise(resolve => httpServer.listen({
        port: 4000
    },resolve))

    console.log("El servidor está funcionando en el puerto 4000")
  }