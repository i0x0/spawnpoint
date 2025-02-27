import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import Auth from './auth';
import User from './user';
import prisma, { Prisma } from 'etc/prisma';
import Universe from './universe';
import Etc from './etc';
import Thumbnail from './thumbnail'
import { custom, Issuer, TokenSet } from 'openid-client';
import { SCOPES } from '@/const';

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

export class RobloxApi {
	private axiosInstance: AxiosInstance;
	private _tokens: TokenSet | null = null;
	public refreshPromise: Promise<TokenSet> | null = null;

	public get tokens(): TokenSet | null {
		return this._tokens;
	}

	public set tokens(value: TokenSet | null) {
		this._tokens = value;
		prisma.user.update({
			where: { id: value?.claims().sub },
			data: {
				data: value as Prisma.JsonObject
			}
		}).catch(console.error).then(() => {
			//console.log("Tokens updated:", value?.access_token);
			this._tokens = value;
		});
	}

	// subclasses
	public auth: Auth
	public user: User
	public universe: Universe
	public etc: Etc
	public thumbnail: Thumbnail
	constructor(public options: { token: TokenResponse } & RobloxApiOptions) {
		this.axiosInstance = axios.create({
			baseURL: 'https://apis.roblox.com/',
			//baseURL: options.baseUrl || 'https://api.roblox.com/v1',
			timeout: 10000,
		});

		// Add request interceptor for token management
		this.auth = new Auth(this)
		this.user = new User(this)
		this.universe = new Universe(this)
		this.etc = new Etc(this)
		this.thumbnail = new Thumbnail(this)
		this.tokens = new TokenSet(this.options.token)
		// prob old tokens
		this.axiosInstance.interceptors.request.use(
			(config) => {
				this.ensureValidToken().then(() => {
					config.headers.Authorization = `Bearer ${this.tokens?.access_token}`;
				})
				return config;
			},
			(error) => {
				console.log("token interceptor error")
				console.log(error)
				Promise.reject(error)
			}, {
			synchronous: false
		}
		);
		this.ensureValidToken()
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
		data?: Partial<AxiosRequestConfig>,
		i: number = 0
	): Promise<T> {
		try {
			const config: AxiosRequestConfig = {
				method,
				url: endpoint,
				...data
			};

			const response = await this.axiosInstance.request<T>(config);
			return response.data;
		} catch (error) {
			console.log("error3", error)
			console.log(2)
			const errors = error as Error | AxiosError;
			if (!axios.isAxiosError(errors)) {
				console.log(1)
				console.log("cause", errors)
				//console.log(errors.rq)
				// do whatever you want with native error
			} else {
				console.log(3)
				//console.log("response", errors.response)
				console.log('status: ', errors.response?.statusText)
				console.log(errors.response?.status)
				//console.log(errors.request.)
				if (errors.response?.data) {
					if (errors.response.data.error) {
						console.log("err_text: ", errors.response.data.error)
						console.log("err_desc: ", errors.response.data.error_description)
						if (errors.response?.status === 401 && errors.response.data.error === "invalid_token") {
							if (i >= 5) {
								console.log("invalid token, too many retries")
								throw new RobloxApiError(`Request failed: ${endpoint}`);
							}
							console.log("invalid token trying again")
							return await this.request<T>(method, endpoint, data, i + 1)
						}
					}
					console.log("request url:", errors.config?.url)
				}
				console.log(errors.response)
			}
			//console.log(error)
			throw new RobloxApiError(`Request failed: ${endpoint}`);
		}
	}
}

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