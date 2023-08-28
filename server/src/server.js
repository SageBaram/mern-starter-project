import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import http from "http";
import _ from "lodash";

import { config } from "./config/config.js";
import Logger from "./library/Logger.js";

const app = express();

app.locals._ = _;

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

mongoose
	.connect(config.mongo.url, { retryWrites: true, w: "majority" })
	.then(() => {
		Logger.info("Connected successfully to MongoDB!\n");
		startServer();
	})
	.catch((error) => {
		Logger.error("Unable to connect: ");
		Logger.error(error);
	});

const startServer = () => {
	app.use((req, res, next) => {
		// log the request
		Logger.info(
			`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`,
		);

		res.on("finish", () => {
			Logger.info(
				`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`,
			);
		});
		next();
	});

	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization",
		);

		if (req.method == "OPTIONS") {
			res.header(
				"Access-Control-Allow-Methods",
				"PUT, POST, PATCH, DELETE, GET",
			);
			return res.status(200).json({});
		}
		next();
	});

	/** Healthcheck */
	app.get("/ping", (_, res) => res.status(200).json({ message: "pong" }));

	/** Routes */

	/** Error Handling */
	app.use((_, res) => {
		const error = new Error("not found");
		Logger.error(error);
		return res.status(404).json({ message: error.message });
	});

	http
		.createServer(app)
		.listen(config.server.port, () =>
			Logger.info(`Server is running on port ${config.server.port}`),
		);
};
