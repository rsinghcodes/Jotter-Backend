const usersResolvers = require('./users');
const pasteBinResolvers = require('./pasteBin');

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...pasteBinResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...pasteBinResolvers.Mutation,
  },
};
