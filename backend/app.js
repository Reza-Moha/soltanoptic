require("dotenv").config();
const { Associations } = require("./app/models/Associations");
const Application = require("./app/server");

Associations();
const PORT = process.env.PORT;
new Application(PORT);
