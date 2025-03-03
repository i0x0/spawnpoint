import { cookiesAPI } from "@/lib/cookies";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await cookiesAPI(req, res)
	delete session.keys
	await session.save()
	res.redirect("/")
}