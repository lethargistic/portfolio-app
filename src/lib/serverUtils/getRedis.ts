import {Redis} from "@upstash/redis";
import {
    SECRET_UPSTASH_REDIS_REST_TOKEN,
    SECRET_UPSTASH_REDIS_REST_URL
} from "$env/static/private";

let redis: Redis | null = null;

export const getRedis = () => {
    if (!redis) {
        redis = new Redis({
            url: SECRET_UPSTASH_REDIS_REST_URL,
            token: SECRET_UPSTASH_REDIS_REST_TOKEN
        });
    }

    return redis;
}