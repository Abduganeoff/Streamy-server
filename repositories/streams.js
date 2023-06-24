const fc = require("fs");

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
  async getAll() {
    return JSON.parse(
      await fc.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }

  async create(data) {
    const records = await this.getAll();
    records.push(data);
    await this.writeAll(records);
  }

  async writeAll(records) {
    await fc.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }
}

// const test = async () => {
//   const repo = new UserRepository("streams.json");

//   await repo.create({});
//   const streams = await repo.getAll();

//   console.log(streams);
// };

// test();
