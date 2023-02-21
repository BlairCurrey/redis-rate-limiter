import { Request, Response, NextFunction } from "express"
import Redis from 'ioredis'

const redis = new Redis()

interface RateLimiterOptions {
  interval?: number
  limit?: number
}

export function rateLimiter(opts?: RateLimiterOptions){
  const interval = opts?.interval ?? 60_000 // 1 minute
  const limit = opts?.limit ?? 100
  
  return async (req: Request, res: Response, next: NextFunction) => {
    const { ip } = req
    const timestamp = Date.now()
    const key = `rate_limiter:${ip}`

    console.debug(`Request from IP: ${ip} at: ${new Date(timestamp)}`)

    await redis.zadd(key, timestamp, timestamp.toString())

    const intervalAgo = timestamp - interval    
    await redis.zremrangebyscore(key, 0, intervalAgo)

    const count = await redis.zcard(key)

    console.debug(`Found ${count} requests in last ${interval} milliseconds`)

    if (count > limit){
      console.warn('Rate limit exceeded')
      res.status(429).send("Too many requests")
    } else {
      next()
    }
  }
}