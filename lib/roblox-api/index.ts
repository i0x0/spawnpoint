import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import safeAwait from "safe-await";
import { cookies as c } from "next/headers";
import { cookies, cookiesAPI } from "../cookies";
import { redirect } from "next/navigation";

import Auth from './auth';
import User from './user';
import Universe from './universe';
import Etc from './etc';
import Thumbnail from './thumbnail'
import ky, { KyInstance, Options } from 'ky'
import { TokenResponse } from './types';
import Games from './games';

export type RobloxApiOptions = {
	clientId: string;
	clientSecret: string;
	baseUrl?: string;
}

class RobloxApiError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'RobloxApiError';
	}
}

export class RobloxApi {
	public instance: KyInstance;
	public tokens: TokenResponse

	// subclasses
	public auth: Auth
	public user: User
	public universe: Universe
	public etc: Etc
	public thumbnail: Thumbnail
	public games: Games

	constructor(public options: { tokens: TokenResponse } & RobloxApiOptions) {
		// Add request interceptor for token management
		this.tokens = options.tokens
		this.auth = new Auth(this)
		this.user = new User(this)
		this.universe = new Universe(this)
		this.etc = new Etc(this)
		this.thumbnail = new Thumbnail(this)
		this.games = new Games(this)
		// prob old tokens
		this.instance = ky.create({
			prefixUrl: 'https://apis.roblox.com',
			timeout: 10000,
			retry: {
				limit: 3,
				methods: ['get'],
				//statusCodes: [413]
			},
			hooks: {
				beforeRequest: [
					async (request) => {
						request.headers.set('Authorization', `Bearer ${this.tokens?.access_token}`);
					},
					(request) => {
						console.log("[roblox-api] -> " + request.url)
					}
				],
				beforeRetry: [
					async () => {
						//await this.ensureValidToken()
					}
				]
			}
		})

		//this.auth.refresh()
	}


	// Generic authenticated request method
	public async request<T>(
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		endpoint: string,
		data?: Partial<Options>
	): Promise<T> {
		try {
			const response = await this.instance<T>(endpoint, {
				method: method || data?.method,
				...data
			});
			//console.log("response", response)
			return response.json<T>();
		} catch (error: any) {
			//console.log("error", error)
			if (error.name === 'HTTPError') {
				const errorJson = await error.response.json();
				console.log("kyErr", errorJson)
			}

			//console.log(error)
			throw new RobloxApiError(`Request failed: ${endpoint}`);
		}
	}
}

export const auth = async () => {
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

	const x = new RobloxApi({
		tokens: session!.keys! as unknown as TokenResponse,
		clientId: process.env.ROBLOX_ID!,
		clientSecret: process.env.ROBLOX_SECRET!,
		//id: data!.id
	})
	return x
}

export const authApi = async (req: any, res: any) => {
	const [e_, session] = await safeAwait(cookiesAPI(req, res))
	if (e_) {
		console.log("uhh")
		// still dont know
	}

	if (!session?.keys) {
		// def redirect
		redirect('/')
	}

	const x = new RobloxApi({
		tokens: session!.keys! as unknown as TokenResponse,
		clientId: process.env.ROBLOX_ID!,
		clientSecret: process.env.ROBLOX_SECRET!,
		//id: data!.id
	})
	return x
}