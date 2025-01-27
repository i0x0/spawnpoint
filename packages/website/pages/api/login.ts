import type { NextApiRequest, NextApiResponse } from 'next'
import { cookiesAPI } from "@/api"
import { generators } from "openid-client";
import { robloxClient } from 'roblox-api';

//export default async function handler(
//	req: NextApiRequest,
//	res: NextApiResponse
//) {
//	const session = await cookiesAPI(req, res)

//	const code_verifier: string = client.randomPKCECodeVerifier()
//	const code_challenge: string =
//		await client.calculatePKCECodeChallenge(code_verifier)
//	let state!: string
//	const parameters: Record<string, string | string[]> = {
//		redirect_uri: "http://localhost:3000/api/callback",
//		scope: SCOPES,
//		code_challenge,
//		response_type: "code",
//		//prompt: "consent",
//		code_challenge_method: 'S256',
//	}

//	console.log("pk: ", config.serverMetadata().supportsPKCE())
//	if (!config.serverMetadata().supportsPKCE()) {
//		//console.log(1)
//		/**
//		 * We cannot be sure the server supports PKCE so we're going to use state too.
//		 * Use of PKCE is backwards compatible even if the AS doesn't support it which
//		 * is why we're using it regardless. Like PKCE, random state must be generated
//		 * for every redirect to the authorization_endpoint.
//		 */
//		state = client.randomState()
//		parameters.state = state
//		//res.status(200).json({ message: 'Hello from Next.js!' })
//	}
//	const redirectTo: URL = client.buildAuthorizationUrl(config, parameters)
//	session.code_verifier = code_verifier
//	session.state = state
//	await session.save()
//	//console.log(session)
//	// now redirect the user to redirectTo.href
//	console.log('redirecting to', redirectTo.href)
//	res.redirect(redirectTo.href)
//}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {

	const session = await cookiesAPI(req, res)
	const state = generators.state();
	const nonce = generators.nonce();
	session.state = state
	session.nonce = nonce
	await session.save()
	res.redirect(robloxClient.authorizationUrl({
		scope: robloxClient.scope,
		state,
		nonce,
	}))
}
