import { cookiesAPI } from "@/cookies";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import { robloxClient } from "@/roblox-api";
import safeAwait from "safe-await"

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await cookiesAPI(req, res)
	if (!session.state || !session.nonce) {
		return res.redirect('/auth/error')
	}
	const params = robloxClient.callbackParams(req)
	const [err, tokenSet] = await safeAwait(
		robloxClient.callback(
			`http://localhost:3000/api/callback`,
			params,
			{
				state: session.state as string,
				nonce: session.nonce as string,
			}
		)
	)
	if (err) {
		console.log(err)
		return res.redirect('/auth/error')
	}
	delete session.state
	delete session.nonce
	await session.save()

	console.log(tokenSet)
	console.log(tokenSet.expiresIn)
	try {
		const userData = jwt.decode(tokenSet.id_token!) as UserJwtPayload
		console.log(userData)
		session.data = tokenSet
		session.id = userData.sub
		await session.save()
	} catch (e) {
		console.log("auth callback error")
		console.log(e)
		return res.redirect('/auth/error')
	}
	return res.redirect('/dashboard')
}