const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);
class UserRepository extends Repository {
  async create(data) {
    data.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex");
    const hashed = await scrypt(data.password, salt, 64);

    const records = await this.getAll();
    const record = { ...data, password: `${hashed.toString("hex")}.${salt}` };

    records.push(record);

    await this.writeAll(records);

    return record;
  }

  async comparePasswords(saved, supplied) {
    // Saved -> password saved in our database. 'hashed.salt'
    const [hashed, salt] = saved.split(".");

    const hashedSupplied = await scrypt(supplied, salt, 64);

    return hashed === hashedSupplied.toString("hex");
  }
}

module.exports = new UserRepository("users.json");
