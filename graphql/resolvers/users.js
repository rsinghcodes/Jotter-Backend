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
    async registerUser(_, { registerInput: { name, email, password } }) {
      // Make sure user doesnt already exist
      const user = await User.findOne({ email });
      if (!!user) {
        throw new UserInputError(
          'An account is already created using this email!',
          {
            errors: {
              message: 'An account is already created using this email!',
            },
          }
        );
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

      // Create token
      const token = jwt.sign(
        { user_id: res._id, email: res.email },
        process.env.SECRET_TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      );

      return {
        ...res._doc,
        id: res._id,
        token,
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

        if (!!user) return user;

        const newUser = new User({
          name: payload.name,
          email: payload.email,
          provider: payload.iss,
          providerId: payload.sub,
          createdAt: new Date().toISOString(),
        });

        const res = await newUser.save();

        const token = jwt.sign(
          { user_id: res._id, email: res.email },
          process.env.SECRET_TOKEN_KEY,
          {
            expiresIn: '2h',
          }
        );

        return {
          ...res._doc,
          id: res._id,
          token,
        };
      } else {
        throw new AuthenticationError('Login unsuccessfull!', {
          errors: {
            message: 'Login unsuccessfull!',
          },
        });
      }
    },

    async loginUser(_, { email, password }) {
      const user = await User.findOne({ email });

      if (!user) {
        throw new UserInputError('Email not found!', {
          errors: {
            message: 'Email not found!',
          },
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new UserInputError('Password is invalid!', {
          errors: {
            message: 'Password is invalid!',
          },
        });
      }

      const token = jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.SECRET_TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      );

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};
