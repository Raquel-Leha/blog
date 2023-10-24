
import { posts } from "./graphql/queries.js";
import { connectDB } from "./db.js";
import { startApolloServer } from "./app.js";


connectDB();
startApolloServer(posts);