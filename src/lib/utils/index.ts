import * as crypto from 'crypto'

export const generateUUID = () => crypto.randomUUID()

export const hashMD5 = (password: string) => String(crypto.createHash('MD5').update(password).digest("hex"))
