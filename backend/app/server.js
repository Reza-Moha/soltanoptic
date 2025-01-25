const express = require("express");
const path = require("path");
const morgan = require("morgan");
const CreateError = require("http-errors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { AllRoutes } = require("./routes/routes.js");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");

module.exports = class Application {
  #app = express();
  #PORT;
  constructor(port) {
    this.#PORT = port;
    this.createServer(port);
    this.configApplication();
    this.createRoutes();
    this.errorHandling();
  }
  configApplication() {
    this.#app.use(
      cors({ credentials: true, origin: process.env.ALLOW_CORS_ORIGIN }),
    );
    this.#app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY));
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(bodyParser.json());
    this.#app.use(express.json());
    this.#app.use(express.static(path.join(__dirname, "public")));
    this.#app.use(helmet());
    this.#app.use(xss());
    this.#app.use(morgan("dev"));
  }
  createServer() {
    http.createServer(this.#app).listen(this.#PORT, () => {
      console.log(
        `server running on ${process.env.SERVERBASEURL}:${this.#PORT}`,
      );
    });
  }
  createRoutes() {
    this.#app.use(AllRoutes);
  }
  errorHandling() {
    this.#app.use((req, res, next) => {
      next(CreateError.NotFound("آدرس مورد نظر یافت نشد"));
    });
    this.#app.use((error, req, res, next) => {
      const statusCode =
        error.status || CreateError.InternalServerError().status;
      const message =
        error.message || CreateError.InternalServerError().message;
      return res.status(statusCode).json({
        errors: {
          statusCode,
          message,
        },
      });
    });
  }
};
