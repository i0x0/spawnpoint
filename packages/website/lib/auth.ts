import safeAwait from "safe-await";
import { cookies as c } from "next/headers";
import { cookies } from "./api";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { RobloxApi, TokenResponse } from "./roblox-api";

export const authRequired = async () => {
	//console.log("authRequired, cachedApi: ", cachedApi)
	const [e, _cookies] = await safeAwait(c());
	if (e) {
		// idk
		console.log("uhh")
	}
	const [e_, session] = await safeAwait(cookies(_cookies as unknown as () => Promise<ReadonlyRequestCookies>))
	if (e_) {
		console.log("uhh")
		// still dont know
	}

	if (!session?.id) {
		// def redirect
		redirect('/')
	}

	const data = await prisma.user.findUnique({
		where: {
			id: session!.id! as unknown as string
		}
	})

	const x = new RobloxApi({
		token: data!.data! as unknown as TokenResponse,
		clientId: process.env.ROBLOX_ID!,
		clientSecret: process.env.ROBLOX_SECRET!,
		//id: data!.id
	})
	return x
}