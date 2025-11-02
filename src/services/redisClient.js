const Redis = require('ioredis');

const  redisClient = new Redis(process.env.REDIS_HOOST);

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
