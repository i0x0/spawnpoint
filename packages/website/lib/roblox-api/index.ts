import Auth from './auth';
import User from './user';
import Universe from './universe';
import Etc from './etc';
import Thumbnail from './thumbnail'
import { custom, Issuer, TokenSet } from 'openid-client';
import { SCOPES } from '@/const';
import ky, { KyInstance, Options } from 'ky'
import { IronSession } from 'iron-session';
import { cookies as c } from "next/headers";
import { cookies } from '@/cookies';

export type RobloxApiOptions = {
	clientId: string;
	clientSecret: string;
	baseUrl?: string;
}

export interface TokenResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
	[key: string]: string | number;
}

class RobloxApiError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'RobloxApiError';
	}
}

async function checkIsServerAction() {
	try {
		// This will throw if executed on client
		c();
		return true;
	} catch {
		return false;
	}
}

export class RobloxApi {
	public instance: KyInstance;
	private _tokens: TokenSet | null = null;
	public refreshPromise: Promise<TokenSet> | null = null;

	public get tokens(): TokenSet | null {
		return this._tokens;
	}

	public set tokens(value: TokenSet | null) {
		this._tokens = value;
		try {
			RobloxApi.saveC(value);
		} catch (e) {
			console.error("Error saving tokens:", e);
		}
	}

	public static async saveC(d: unknown) {
		// Handle both client and server contexts
		if (typeof window === "undefined") {
			// Server-side code
			try {
				// Use a different approach for server-side that doesn't require server actions
				// Store in memory for now (this won't persist across requests)
				RobloxApi._serverSideTokens = d;

				// If we're in a context where we can access the response object
				// (like in API routes), we could set cookies there
				// This is just a fallback for when we can't use cookies()
				console.log("Stored tokens in server memory (will not persist across requests)");
			} catch (serverError) {
				console.error("Server-side storage error:", serverError);
			}
		} else {
			// Client-side code
			try {
				// Use document.cookie for client-side storage
				const tokenString = JSON.stringify(d);
				document.cookie = `robloxTokens=${encodeURIComponent(tokenString)}; path=/; max-age=86400; SameSite=Strict`;
			} catch (clientError) {
				console.error("Client-side cookie save error:", clientError);
			}
		}
	}

	// Static property to store tokens on the server side
	private static _serverSideTokens: unknown = null;

	// Method to get the stored tokens
	public static getServerSideTokens(): unknown {
		return RobloxApi._serverSideTokens;
	}

	// subclasses
	public auth: Auth
	public user: User
	public universe: Universe
	public etc: Etc
	public thumbnail: Thumbnail
	constructor(public options: { token: TokenResponse } & RobloxApiOptions, public session: IronSession<Record<string, unknown>>) {
		// Add request interceptor for token management
		this.tokens = new TokenSet(this.options.token)
		this.ensureValidToken()
		this.auth = new Auth(this)
		this.user = new User(this)
		this.universe = new Universe(this)
		this.etc = new Etc(this)
		this.thumbnail = new Thumbnail(this)
		// prob old tokens
		this.instance = ky.create({
			prefixUrl: 'https://apis.roblox.com',
			timeout: 10000,
			hooks: {
				beforeRequest: [
					async (request) => {
						await this.ensureValidToken()
						request.headers.set('Authorization', `Bearer ${this.tokens?.access_token}`);
					},
					(request) => {
						console.log(request.url)
					}
				],
				beforeRetry: [
					async () => {
						await this.ensureValidToken()
					}
				]
			}
		})

		//this.auth.refresh()
	}

	async ensureValidToken() {
		try {
			// Return early if tokens are still valid
			if (this.tokens && !this.tokens.expired()) {
				return;
			}

			// If a refresh is already in progress, wait for it
			if (this.refreshPromise) {
				await this.refreshPromise;
				return;
			}

			// Start new refresh
			if (!this.tokens?.refresh_token) {
				throw new RobloxApiError('No refresh token available');
			}

			this.refreshPromise = robloxClient.refresh(this.tokens);

			try {
				const newTokens = await this.refreshPromise;
				this.tokens = newTokens;
			} finally {
				this.refreshPromise = null;
			}
		} catch (error) {
			console.error('Token refresh failed:', error);
			throw new RobloxApiError('Failed to refresh access token');
		}
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
		} catch (error) {
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

Issuer.

export const issuer = await Issuer.discover(
	"https://apis.roblox.com/oauth/.well-known/openid-configuration"
);

export const robloxClient = new issuer.Client({
	client_id: process.env.ROBLOX_ID!,
	client_secret: process.env.ROBLOX_SECRET!,
	redirect_uris: [`http://localhost:3000/api/callback`],
	response_types: ["code"],
	scope: SCOPES,
	id_token_signed_response_alg: "ES256",

});

robloxClient[custom.clock_tolerance] = 180;