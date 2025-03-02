import { cookiesAPI } from "@/lib/cookies";
import { SCOPES } from "@/lib/roblox/const";
import { robloxConfig } from "@/lib/roblox/utils";
import { getBaseUrl } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import * as client from 'openid-client';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await cookiesAPI(req, res)
	delete session.state
	delete session.nonce
	const state = client.randomState();
	const nonce = client.randomNonce();
	session.state = state
	session.nonce = nonce
	await session.save()
	let url = client.buildAuthorizationUrl(robloxConfig, {
		redirect_uri: getBaseUrl() + "/api/callback",
		scope: SCOPES,
		state,
		nonce
	})
	res.redirect(url.toString())
}