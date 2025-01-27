import { cookiesAPI } from "@/api";
import { NextApiRequest, NextApiResponse } from "next";
import prisma, { Prisma } from "etc/prisma"
import jwt from 'jsonwebtoken';
import { robloxClient } from "roblox-api";

export type UserJwtPayload = {
	sub: string
	name: string
	nickname: string
	preferred_username: string
	created_at: number
	profile: string
	picture: string
	nonce: string
	jti: string
	nbf: number
	exp: number
	iat: number
	iss: string
	aud: string
}


//export default async function handler(
//	req: NextApiRequest,
//	res: NextApiResponse
//) {
//	const session = await cookiesAPI(req, res);
//	const query = req.query

//	const code = query['code']
//	const state = query['state']

//	const storedState = session.state
//	const codeVerifier = session.code_verifier
//	console.log('everything', {
//		code, state, storedState, codeVerifier
//	})

//	if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
//		console.log('wtf')
//		return res.redirect('/auth/error');
//	}


//	try {
//		console.log('config: ', config)
//		//console.log(req.url)
//		//const tokens = await .exchangeCodeForTokens(code, codeVerifier);
//		const tokens: client.TokenEndpointResponse = await client.authorizationCodeGrant(
//			config,
//			new URL('http://localhost:3000' + req.url!),
//			{
//				pkceCodeVerifier: codeVerifier as unknown as string,
//				expectedState: state as unknown as string,
//			},
//		)


//		console.log(tokens)
//		// Clear PKCE and state cookies
//		//cookieStore.delete('code_verifier');
//		//cookieStore.delete('state');

//		//session.destroy()
//		delete session.state
//		delete session.code_verifier
//		// Set the access token in an HTTP-only cookie
//		//cookieStore.set('access_token', tokens.access_token, {
//		//	httpOnly: true,
//		//	secure: process.env.NODE_ENV === 'production',
//		//	sameSite: 'lax'
//		//});

//		// NOTE: so apparently roblox gives short notice tokens to then exchance

//		//session.access = tokens
//		//const userInfo = await OAuthApi.userInfo.bind({ oauthToken: tokens.access_token })()
//		//console.log("user:", userInfo.data.name)
//		const api = new RobloxApi({
//			access_token: tokens.access_token,
//			refresh_token: tokens.refresh_token!,
//			clientId: process.env.ROBLOX_ID!,
//			clientSecret: process.env.ROBLOX_SECRET!
//		})
//		console.log(3)
//		await api.auth.refresh()
//		console.log(5)
//		let user = await api.user.self()
//		try {
//			console.log(1)
//			const x = await prisma.user.upsert({
//				where: {
//					id: Number(user.sub)
//				},
//				create: {
//					id: Number(user.sub),
//					access_token: tokens.access_token!,
//					refresh_token: tokens.refresh_token!,
//					id_token: tokens.id_token!,
//					scope: tokens.scope! || "",
//					account: {
//						create: {
//							teams: {
//								create: {
//									id: Number(user.sub),
//									name: `${user.name}'s Team`,
//									type: "SINGLE",
//								}
//							}
//						}
//					},
//				},
//				update: {
//					access_token: tokens.access_token!,
//					refresh_token: tokens.refresh_token!,
//					id_token: tokens.id_token!,
//					scope: tokens.scope! || "",
//					account: {
//						update: {}
//					}
//				}
//			})
//			console.log(2)
//			console.log('dat: ', x)
//			session.id = x.id
//			await session.save()
//			return res.redirect('/dashboard');
//		} catch (e) {
//			console.log('prisma err: ', e)
//		}
//	} catch (error) {
//		console.error('Token exchange error:', error);
//		console.log(error.stack)
//		return res.redirect('/auth/error');
//	}
//	//const searchParams = URL.parse(req.url, true)
//}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await cookiesAPI(req, res)
	if (!session.state || !session.nonce) {
		return res.redirect('/auth/error')
	}
	const params = robloxClient.callbackParams(req)
	const tokenSet = await robloxClient.callback(
		`http://localhost:3000/api/callback`,
		params,
		{
			state: session.state as string,
			nonce: session.nonce as string,
		}
	);
	console.log(tokenSet)
	delete session.state
	delete session.nonce
	await session.save()
	try {
		const userData = jwt.decode(tokenSet.id_token!) as UserJwtPayload
		console.log(userData)
		await prisma.user.upsert({
			where: {
				id: userData!.sub
			},
			create: {
				id: userData!.sub,
				data: tokenSet as Prisma.JsonObject,
				account: {
					create: {
						teams: {
							create: {
								id: userData!.sub,
								name: `${userData!.name}'s Team`,
								type: "SINGLE",
							}
						}
					}
				}
			},
			update: {
				data: tokenSet as Prisma.JsonObject,
			}
		})
		session.id = userData.sub
		await session.save()
	} catch (e) {
		console.log("auth callback error")
		console.log(e)
		return res.redirect('/auth/error')
	}
	return res.redirect('/dashboard')
}
