import { SetOptions, createClient } from 'redis'
import config from '../config'
import { logger } from './logger'

const redisClient = createClient({
  url: config.redis.url,
})

redisClient.on('error', error => logger.error('RedisError', error))
redisClient.on('connect', error => logger.info('Redis Connected'))

const connect = async (): Promise<void> => {
  await redisClient.connect()
}

const disconnect = async (): Promise<void> => {
  await redisClient.quit()
}

export const RedisClient = {
  connect,
  disconnect,
  redisClient,
}
