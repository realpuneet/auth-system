const Redis = require('ioredis');

const  redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

redisClient.on("connect",()=>{
    console.log("Redis connected");
});

redisClient.safeGet = async(key) => {
    try {
        return await redisClient.get(key);
    } catch (error) {
        console.error("Redis Get Error", error);
        return null
    }
}

module.exports = redisClient;
