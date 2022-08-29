const Pastebin = require('../../models/Pastebin');

module.exports = {
  Query: {
    async getPasteBinById(_, { pasteBinId }) {
      try {
        const pasteBin = await Pastebin.findById(pasteBinId);
        return pasteBin;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
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
