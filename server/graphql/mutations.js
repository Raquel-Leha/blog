const { GraphQLString, GraphQLID } = require("graphql");
const { User , Post, Comment } = require("../models");
const { createJWTToken } = require("../util/auth");
const { PostType, CommentType} = require('../graphql/typedef')



const register = {
  type: GraphQLString,
  description: "Registra a un nuevo usuario y devuelve un token",
  args: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    nickName: { type: GraphQLString },
  },
  async resolve(_, args) {
    const { name, email, password, nickName } = args;
    const user = new User({ name, email, password, nickName });
    await user.save();
    const token = createJWTToken({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
    return token;
  },
};

const login = {
  type: GraphQLString,
  description: 'Logea a un usuario y devuelve un token',
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(_, args) {
    const user = await User.findOne({ email: args.email }).select("+password");

    if (!user || args.password !== user.password)
      throw new Error("Credenciales inválidas");

    const token = createJWTToken({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
    return token;
  },
};

const createPost = {
    type: PostType,
    description: 'Creación de un nuevo post',
    args: {
        title: {type: GraphQLString},
        body: {type: GraphQLString},
    },
    async resolve(_, args, {verifiedUser}){
        console.log(args)
        const newPost = new Post({
          title: args.title,
          body: args.body,
          authorId: verifiedUser._id
        })

        await newPost.save();

        return newPost;
    
    }

}

const updatePost = {
  type: PostType,
  description: "Actualizar o modificar un post",
  args: {
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    body: {type: GraphQLString},
  },
  async resolve(_,{id,title,body},{verifiedUser}){
    if(!verifiedUser) throw new Error("No estás autorizado");
    const updatedPost = await Post.findOneAndUpdate(
      {_id: id, authorId: verifiedUser._id},
      {
        title,
        body,
      },
      {
        new: true,
        runValidators: true,
      }
    )
    return updatePost;
  }
}

const deletePost = {
  type: GraphQLString,
  description: "Eliminar una publicación",
  args: {
    id: {type: GraphQLID},
  },
  async resolve(_,{id},{verifiedUser}){
    if(!verifiedUser) throw new Error("No estás autorizado para eliminar la publicación");
    const postDeleted = await Post.findByIdAndDelete(
      {_id: id, authorId: verifiedUser._id},
    )
    if(!postDeleted) throw new Error("El post no fue encontrado");

    return 'Post eliminado';
  }
}

const addComment = {
  type: CommentType,
  description: "Añadir un comentario a algún post publicado.",
  args: {
    comment: {type: GraphQLString},
    postId: {type: GraphQLID},
  },
  async resolve(_, {comment, postId}, {verifiedUser}){
    const newComment = new Comment({
      comment,
      postId,
      userId: verifiedUser._id,
    })
    return await newComment.save();
  }
}

const updateComment = {
  type: CommentType,
  description: "Actualizamos un comentario",
  args: {
    id: {type: GraphQLID},
    comment: {type: GraphQLString}
  },
  async resolve(_,{id,comment},{verifiedUser}){
    if(!verifiedUser) throw new Error("No estás autorizado para actualizar este comentario.");
    const commentUpdated = await Comment.findOneAndUpdate(
      {
        _id: id,
        userId: verifiedUser._id,
      },
      {
        comment
      }
    )
    if(!commentUpdated) throw new Error("El comentario no se encuentra.")

    return commentUpdated;
  }
}

const deleteComment = {
  type: GraphQLString,
  description: "Elimina un comentario",
  args: {
    id: {type: GraphQLID},
  },
  async resolve(_,{id}, {verifiedUser}){
    if(!verifiedUser) throw new Error ("No estás autorizado");

    const commentDelete = await Comment.findOneAndDelete({
      _id: id,
      userId: verifiedUser._id,
    })
    if(!commentDelete) throw new Error("El comentario no ha sido encontrado");
    return "Comentario eliminado"
  }
}



module.exports = {
  register,
  login,
  createPost,
  updatePost,
  deletePost,
  addComment,
  updateComment, 
  deleteComment
};
