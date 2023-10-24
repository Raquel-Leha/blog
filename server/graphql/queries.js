import {GraphQLString, GraphQLList, GraphQLID} from 'graphql';
import  { UserType, PostType, CommentType } from './typedef';
const {User, Post, Comment} = require('../models');

const users = {
    type: new GraphQLList(UserType),
    async resolve () {
       return await User.find();
    }
}

const user = {
    type: UserType,
    description: 'Obtener un usuario por ID',
    args: {
        id: {type: GraphQLID}
    },
    resolve (_, args) {
       return User.findById(args.id)
    }
}

export const posts = {
    type: new GraphQLList(PostType),
    description: "Devuelve todas las publicaciones",
    resolve: async () => {
        const posts = await Post.find()
        console.log(posts)
        return posts;
    }
}

const post = {
    type: PostType,
    description: "Devuelve una única publicación",
    args: {
        id: {type: GraphQLID},
    },
    async resolve (_, args){
        const post = await Post.findById(args.id)
        return post;
    }
}

const comment = {
    type: CommentType,
    description: "Devuelve los comentarios de una publicación",
    args: {
        id: {type: GraphQLID}
    },
    resolve: (_,{id}) => Comment.findById(id),
}

const comments = {
    type: new GraphQLList(CommentType),
    description: "Devuelve todos los comentarios",
    resolve: () =>  Comment.find()
    
}

module.exports = { users, user, posts, post, comments, comment }