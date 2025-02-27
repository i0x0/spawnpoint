import type { NextApiRequest, NextApiResponse } from 'next'
import { cookiesAPI } from "@/api"
import { generators } from 'openid-client'
import { robloxClient } from '@/roblox-api'
import { SCOPES } from '@/const'

//import { robloxConfig } from '@/roblox-api';
//import * as client from 'openid-client';
//import { SCOPES } from '@/const';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await cookiesAPI(req, res)
	delete session.state
	delete session.nonce
	const state = generators.state();
	const nonce = generators.nonce();
	session.state = state
	session.nonce = nonce
	await session.save()
	res.redirect(robloxClient.authorizationUrl({
		scope: SCOPES,
		state,
		nonce,
	}))
}

//export default async function handler(
//	req: NextApiRequest,
//	res: NextApiResponse
//) {
//	const session = await cookiesAPI(req, res)
//	delete session.state
//	delete session.verifier
//	const nonce = client.randomNonce()
//	const state = client.randomState()
//	session.state = state
//	session.nonce = nonce
//	await session.save()
//	res.redirect(client.buildAuthorizationUrl(robloxConfig, {
//		redirect_uri: `http://${process.env.HOST ?? 'localhost:3000'}/api/callback`,
//		scope: SCOPES,
//		state,
//		nonce,

//	}).toString())
//}