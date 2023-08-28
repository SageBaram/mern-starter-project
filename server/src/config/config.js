import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/../../../.env` });

const IGNORE_PATHS = [
	"favicon.ico",
	"robots.txt",
	"humans.txt",
	"sitemap.xml",
	"ads.txt",
];
const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_CLUSTER = process.env.MONGO_CLUSTER || "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.gsjxhlr.mongodb.net/blog`;
const SERVER_PORT = process.env.SERVER_PORT
	? Number(process.env.SERVER_PORT)
	: 1337;

export const config = {
	mongo: {
		url: MONGO_URL,
	},
	server: {
		port: SERVER_PORT,
	},
	ignore: IGNORE_PATHS,
};
