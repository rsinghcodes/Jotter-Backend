const { UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
    async googleAuth(_, { idToken }) {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const { payload } = await client.verifyIdToken({
        idToken: idToken,
        audience: clientId,
      });

      if (payload.email_verified) {
        const user = await User.findOne({ email: payload.email });

        if (!!user) {
          const newToken = jwt.sign(
            { userId: user._id },
            process.env.SECRET_TOKEN_KEY,
            {
              expiresIn: '2h',
            }
          );

          return {
            token: newToken,
          };
        }

        const newUser = new User({
          name: payload.name,
          email: payload.email,
          provider: payload.iss,
          providerId: payload.sub,
          createdAt: new Date().toISOString(),
        });

        const res = await newUser.save();

        const createToken = jwt.sign(
          { userId: res._id },
          process.env.SECRET_TOKEN_KEY,
          {
            expiresIn: '2h',
          }
        );

        return {
          token: createToken,
        };
      } else {
        throw new AuthenticationError('Login unsuccessfull!', {
          errors: {
            message: 'Login unsuccessfull!',
          },
        });
      }
    },
  },
};
