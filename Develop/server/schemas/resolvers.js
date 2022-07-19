const { User, Book } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, { username, email, _id }, context) => {
      
      if (context.user) {
        const foundUser = await User.findOne({
          $or: [{ _id: _id }, { username: username }],
        });
        return foundUser;
      }
      AuthenticationError("You are not logged in!")
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email: email });

      if (!user) {
        AuthenticationError("Incorrect Credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        AuthenticationError("Incorrect Credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      try {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.log(err);
      }
    },
    saveBook: async (parent, { userInput, saveBookInput }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userInput._id },
          { $addToSet: { savedBooks: saveBookInput } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        console.log(err);
      }
    },
    deleteBook: async (parent, { userInput, bookId }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userInput._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true, runValidators: true }
        );
        console.log(updatedUser);
        return updatedUser;
      } catch (err) {
        console.log(err);
      }
    },
  },
};

module.exports = resolvers;