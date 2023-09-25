import { config } from 'dotenv';

config();


// Mongo Details      
const MONGO_USERNAME = "";
const MONGO_PASSOWRD = "";
const MONGO_DATABASE = "";
const MONGO_STRING = process.env.MONGO_URI || "mongodb://localhost:27017/TriluxoApp";

const MONGO = {
    username: MONGO_USERNAME,
    passowrd: MONGO_PASSOWRD,
    database: MONGO_DATABASE,
    string: MONGO_STRING,
}

// SERVER DETAILS
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "127.0.0.1";
const SERVER_PORT = process.env.PORT || "303030";
const JWT_SECRET = process.env.JWT_SECRET || "DF5F4DDFD5ERE2ER6RR515ER65ER6512rER45RE1ER6R1EFE15156E";

const KEY = {
    jwt_secret:JWT_SECRET
}

// SERVER DETAILS
const SERVER = {
    hostname:SERVER_HOSTNAME,
    port:SERVER_PORT
}

// CLOUDINARY DETAILS
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || "";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

const CLOUDINARY = {
    name:CLOUDINARY_NAME,
    api_key:CLOUDINARY_API_KEY,
    api_secret:CLOUDINARY_API_SECRET
}

const myConfig = {
    mongo:MONGO,
    key:KEY,
    server:SERVER,
    cloudinary:CLOUDINARY
}


export default myConfig;



