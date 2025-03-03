import { cookiesAPI } from "@/lib/cookies";
import { robloxConfig } from "@/lib/roblox/utils";
import { createLogger, getBaseUrl } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/navigation";
import * as client from 'openid-client';

interface OAuthError {
	code: string;
	error: string;
	status: number;
	error_description: string;
	cause?: any;
}

const log = createLogger('callback');


export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await cookiesAPI(req, res)
	if (!session.nonce || !session.state) {
		res.redirect("/error")
	}
	let url = getBaseUrl() + req.url
	try {
		let tokens = await client.authorizationCodeGrant(robloxConfig, new URL(url), {
			expectedNonce: session.nonce as unknown as string,
			expectedState: session.state as unknown as string,
		})
		delete session.nonce
		delete session.state
		let fresh = await client.refreshTokenGrant(robloxConfig, tokens.refresh_token!)
		log(fresh)
		session.keys = fresh
		await session.save()
		res.redirect("/dashboard")
	} catch (e: any) {
		//console.log("n", e.name)
		if (e.name === "ResponseBodyError") {
			if (e.error_description = "Authorization code has expired") {
				res.redirect("/error")
			}
		}
	}
}