import { NextApiRequest, NextApiResponse } from "next";
import safeAwait from "safe-await";
import { RobloxApi, TokenResponse } from "./roblox-api";
import { redirect } from "next/navigation";
import { cookiesAPI } from "./cookies";

export const authRequiredApi = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	//console.log("authRequired, cachedApi: ", cachedApi)
	const [e, session] = await safeAwait(cookiesAPI(req, res));
	if (e) {
		// idk
		console.log("uhh")
	}

	if (!session?.id) {
		// def redirect
		redirect('/')
	}

	const x = new RobloxApi({
		token: session.data! as unknown as TokenResponse,
		clientId: process.env.ROBLOX_ID!,
		clientSecret: process.env.ROBLOX_SECRET!,
	}, session)
	return x
}