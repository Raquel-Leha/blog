const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLScalarType, GraphQLList } = require("graphql");
const { User, Post, Comment} = require('../models')


export const UserType = new GraphQLObjectType({
  name: "Usertype",
  description: "The user type",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    nickName: { type: GraphQLString },
    createdAt: {type: GraphQLString},
    updatedAt: {type: GraphQLString}
  },
});

export const PostType = new GraphQLObjectType({
  name: 'PostType',
  description: "The post type",
  fields: () => ( {
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    body: {type: GraphQLString},
    author: {type: UserType, resolve(parent){
      return User.findById(parent.authorId)
    }},
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent){
        return Comment.find({postId: parent.id})
      }
    }
  })
})

export const CommentType = new GraphQLObjectType({
  name: "CommentType",
  description: "The comment type",
  fields:  {
    id: {type: GraphQLID},
    comment: {type: GraphQLString},
    user: { type: UserType, resolve(parent){
      return User.findById(parent.userId);
    }},
    post: {type: PostType, resolve(parent){
      return Post.findById(parent.postId);
    }},
  }
});






