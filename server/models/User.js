const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false, //para que la contraseña no forme parte del token
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/,
      "Ingresa un correo válido",
    ],
  },
  nickName: {
    type: String,
    required: true,
    unique: true,
  },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = model("User", userSchema);
