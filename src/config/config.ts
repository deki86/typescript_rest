import dotenv from 'dotenv';

dotenv.config();

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: true
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'user';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'user';
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';

const MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    url: `mongodb://${MONGO_HOST}/restApi`
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 8001;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'issuer';
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || 'supersecret';

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        exppireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};

const config = {
    mongo: MONGO,
    server: SERVER
};

export default config;
