import * as client from 'openid-client'
import { ROBLOX_OAUTH } from '@/lib/roblox/const'

export const robloxConfig = await client.discovery(new URL(ROBLOX_OAUTH), process.env.ROBLOX_ID, {
	client_id: process.env.ROBLOX_ID,
	client_secret: process.env.ROBLOX_SECRET,
	id_token_signed_response_alg: "ES256",
	[client.clockTolerance]: 180
})