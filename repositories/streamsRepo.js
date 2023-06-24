const Repository = require("./repository");

class StreamRepository extends Repository {}

module.exports = new StreamRepository("streams.json");
