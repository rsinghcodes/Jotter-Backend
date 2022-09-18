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
  type successInfo {
    message: String
    success: Boolean
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
    registerUser(registerInput: UserInput): User!
    createPastebin(pastebinInput: PasteBinInput): PasteBin
    googleAuth(idToken: String!): User!
  }
`;
