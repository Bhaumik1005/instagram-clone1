import environment from '../../environment';
const envConfig = environment[process.env.NODE_ENV];

module.exports = {
    port: envConfig.port,
    dbName: envConfig.dbName,
    mongoUri: envConfig.mongoUri,
    jwtSecrate: envConfig.jwtSecrate,
    userEmail: envConfig.userEmail,
    userPass: envConfig.userPass
};