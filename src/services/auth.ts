import { EncryptJWT, jwtDecrypt, JWTPayload } from 'jose'
import { cookies } from 'next/headers'

if (!process.env.JWT_SECRET) {
  throw new Error('CRITICAL: JWT_SECRET environment variable is not set!')
}

const SECRET = new Uint8Array(
  process.env.JWT_SECRET.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
)

export async function encrypt(payload: JWTPayload) {
  return await new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .encrypt(SECRET)
}

export async function decrypt(input: string) {
  const { payload } = await jwtDecrypt(input, SECRET, {
    contentEncryptionAlgorithms: ['A256GCM'],
  })
  return payload
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value
  if (!session) return null
  try {
    return await decrypt(session)
  } catch {
    return null
  }
}
