const { UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// models
const User = require('../../models/User');

module.exports = {
  Query: {
    async getUsers() {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUserById(_, { userId }) {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async registerUser(_, { registerInput: { name, email, password } }) {
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
        name,
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

    async googleAuth(_, { idToken }) {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const { payload } = await client.verifyIdToken({
        idToken: idToken,
        audience: clientId,
      });

      if (payload.email_verified) {
        const user = await User.findOne({ email: payload.email });

        if (!user) {
          const newUser = new User({
            name: payload.name,
            email: payload.email,
            provider: payload.iss,
            providerId: payload.sub,
            createdAt: new Date().toISOString(),
          });

          const res = await newUser.save();

          return {
            ...res._doc,
            id: res._id,
          };
        } else {
          const user = await User.findOne({ email: payload.email });
          return user;
        }
      } else {
        throw new AuthenticationError('Login unsuccessfull!', {
          errors: {
            email: 'Login unsuccessfull!',
          },
        });
      }
    },
  },
};
