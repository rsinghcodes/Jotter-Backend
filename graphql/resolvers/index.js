const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
// models
const User = require('../../models/User');
const Pastebin = require('../../models/Pastebin');

module.exports = {
  Query: {
    async getUsers() {
      try {
        const user = await User.find();
        return user;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async registerUser(_, { registerInput: { fullname, email, password } }) {
      // Make sure user doesnt already exist
      const user = await User.findOne({ email });
      if (user) {
        throw new UserInputError('Email is already taken', {
          errors: {
            email: 'Account is already created using this email!',
          },
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        fullname,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      return {
        ...res._doc,
        id: res._id,
      };
    },

    async createPastebin(_, { pastebinInput: { details } }) {
      const newPastebin = new Pastebin({
        details,
        createdAt: new Date().toISOString(),
      });

      const res = await newPastebin.save();

      return {
        ...res._doc,
        id: res._id,
      };
    },
  },
};
