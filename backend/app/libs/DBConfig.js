const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Reza2198000@@@avinam",
  database: "soltanoptic",
  logging: false,
});
sequelize
  .authenticate()

  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
module.exports = {
  sequelize,
};
