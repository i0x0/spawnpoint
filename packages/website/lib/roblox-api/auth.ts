import Prototype from "./prototype";
import { RobloxAuthIntrospect } from "./types";
import qs from 'qs';
import safeAwait from 'safe-await';

export type RobloxAuthResources = {
	resource_infos: Array<{
		owner: {
			id: string
			type: "Group" | "User"
		}
		resources: {
			universe: {
				ids: Array<string>
			}
		}
	}>
}


export default class Auth extends Prototype {
	public async introspect(token: string) {
		return await safeAwait(
			this.root.request<RobloxAuthIntrospect | {
				active: false
			}>("POST", "/oauth/v1/token/introspect", {
				headers: {
					'Content-Type': "application/x-www-form-urlencoded"
				},
				data: qs.stringify({
					token: token,
					client_id: this.root.options.clientId,
					client_secret: this.root.options.clientSecret
				})
			})
		)
	}

	public async resources() {
		return await this.root.request<RobloxAuthResources>("POST", "/oauth/v1/token/resources", {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: qs.stringify({
				token: this.root.tokens?.access_token,
				client_id: this.root.options.clientId,
				client_secret: this.root.options.clientSecret
			})
		})
	}
}