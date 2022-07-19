const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: String!
    savedBooks: [Book]
  }
  type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String!
  }
  type Auth {
    token: ID!
    user: User
  }
  input saveBookInput {
    authors: [String]
    description: String
    title: String
    bookId: String
    image: String
  }
  input userInput {
    _id: ID!
    username: String!
    email: String!
  }
  type Query {
    me(username: String, email: String, _id: ID): User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(userInput: userInput!, saveBookInput: saveBookInput!): User
    deleteBook(userInput: userInput!, bookId: String!): User
  }
`;

module.exports = typeDefs;