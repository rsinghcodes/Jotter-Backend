const { gql } = require('apollo-server');

module.exports = gql`
  type PasteBin {
    id: ID!
    details: String!
    createdAt: String
  }
  type User {
    id: ID!
    fullname: String!
    email: String!
    createdAt: String!
  }
  input UserInput {
    fullname: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  input PasteBinInput {
    details: String!
  }
  type Query {
    pastebin: [PasteBin]
    getUsers: [User]
  }
  type Mutation {
    registerUser(registerInput: UserInput): User!
    createPastebin(pastebinInput: PasteBinInput): PasteBin
  }
`;
