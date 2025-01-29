import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import Auth from './auth';
import User from './user';
import { SCOPES } from '../website/lib/const';
import { Issuer, TokenSet, custom } from 'openid-client';
import prisma, { Prisma } from 'etc/prisma';
import Universe from './universe';
import Etc from './etc';
import Thumbnail from './thumbnail';


export interface RobloxApiOptions {
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
			console.log("updated");
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
		this.axiosInstance.interceptors.request.use(
			async (config) => {
				this.ensureValidToken().then(() => {
					if (this.tokens && !this.tokens.expired()) {
						config.headers.Authorization = `Bearer ${this.tokens.access_token}`;
					}
				})

				return config;
			},
			(error) => {
				console.log(error)
				Promise.reject(error)
			}
		);
		this.auth = new Auth(this)
		this.user = new User(this)
		this.universe = new Universe(this)
		this.etc = new Etc(this)
		this.thumbnail = new Thumbnail(this)
		this.tokens = new TokenSet(this.options.token)
		// prob old tokens
		//this.ensureValidToken()
		//this.auth.refresh()
	}

	async ensureValidToken() {
		try {
			// Add buffer time to check expiration (e.g., 60 seconds before actual expiration)
			const EXPIRATION_BUFFER = 60;

			if (this.tokens &&
				this.tokens.expires_at &&
				this.tokens.expires_at > (Date.now() / 1000) + EXPIRATION_BUFFER) {
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
			} catch (error) {
				console.log(error)
				console.error('Token refresh failed:', error);
				// Clear tokens if refresh fails
				this.tokens = null;
				throw error;
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
		data?: AxiosRequestConfig<unknown>
	): Promise<T> {
		try {
			const response = await this.axiosInstance.request<T>({
				method,
				url: endpoint,
				//data: data
				...data
			});
			return response.data;
		} catch (error) {
			console.log(2)
			const errors = error as Error | AxiosError;
			if (!axios.isAxiosError(errors)) {
				console.log(1)
				//console.log(errors.cause)
				//console.log(errors.rq)
				// do whatever you want with native error
			} else {
				console.log(3)
				//console.log(errors.response)
				console.log('status: ', errors.response?.statusText)
				console.log(errors.response?.status)
				//console.log(errors.request.)
				if (errors.response?.data) {
					if (errors.response.data.error) {
						console.log("err_text: ", errors.response.data.error)
						console.log("err_desc: ", errors.response.data.error_description)
					}
					console.log("request url:", errors.config?.url)
				}
				//console.log(errors.response)
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