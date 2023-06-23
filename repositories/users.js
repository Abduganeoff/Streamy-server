const fc = require("fs");
const crypto = require("crypto");

class UserRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }

    this.filename = filename;
    try {
      fc.accessSync(this.filename);
    } catch (err) {
      fc.writeFileSync(this.filename, "[]");
    }
  }

  async getOne(id) {
    const users = await this.getAll();
    return users.find((user) => user.id === id);
  }

  async getAll() {
    return JSON.parse(
      await fc.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }

  async create(data) {
    data.id = this.randomId();
    const records = await this.getAll();
    records.push(data);
    await this.writeAll(records);
    return data.id;
  }

  async writeAll(records) {
    await fc.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, data) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    Object.assign(record, data);

    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
}

// const test = async () => {
//   const repo = new UserRepository("users.json");
//   //   await repo.create({
//   //     email: "test@test.com",
//   //   });
//   const user = await repo.getOneBy({
//     email: "test@test.cosm",
//   });
//   console.log(user);
// };

// test();

module.exports = new UserRepository("users.json");
