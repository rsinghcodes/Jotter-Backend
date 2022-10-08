const { gql } = require('apollo-server');

module.exports = gql`
  type PasteBin {
    id: ID!
    details: String!
    createdAt: String
  }
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
  }
  type Token {
    token: String!
  }
  input UserInput {
    name: String!
    email: String!
    password: String!
  }
  input PasteBinInput {
    details: String!
  }
  type Query {
    getUsers: [User]
    getUserById(userId: ID!): User
    pastebin: [PasteBin]
    getPasteBinById(pasteBinId: ID!): PasteBin
  }
  type Mutation {
    createPastebin(pastebinInput: PasteBinInput): PasteBin
    googleAuth(idToken: String!): Token!
  }
`;
