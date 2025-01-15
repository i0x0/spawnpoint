import { config, cookiesAPI } from "@/api";
import { NextApiRequest, NextApiResponse } from "next";
import * as client from 'openid-client';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await cookiesAPI(req, res);
	const query = req.query

	const code = query['code']
	const state = query['state']

	const storedState = session.state
	const codeVerifier = session.code_verifier
	console.log('everything', {
		code, state, storedState, codeVerifier
	})

	if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
		console.log('wtf')
		return res.redirect('/auth/error');
	}


	try {
		console.log(req.url)
		//const tokens = await .exchangeCodeForTokens(code, codeVerifier);
		const tokens: client.TokenEndpointResponse = await client.authorizationCodeGrant(
			config,
			new URL('http://localhost:3000' + req.url!),
			{
				pkceCodeVerifier: codeVerifier as unknown as string,
				expectedState: state as unknown as string,
			},
		)

		console.log(tokens)
		// Clear PKCE and state cookies
		//cookieStore.delete('code_verifier');
		//cookieStore.delete('state');

		//session.destroy()
		delete session.state
		delete session.code_verifier
		// Set the access token in an HTTP-only cookie
		//cookieStore.set('access_token', tokens.access_token, {
		//	httpOnly: true,
		//	secure: process.env.NODE_ENV === 'production',
		//	sameSite: 'lax'
		//});

		session.access = tokens
		await session.save()
		return res.redirect('/dashboard');
	} catch (error) {
		console.error('Token exchange error:', error);
		return res.redirect('/auth/error');
	}
	//const searchParams = URL.parse(req.url, true)
}