import Prototype from "./prototype";
import { RobloxAuthIntrospect } from "./types";
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
			}>("POST", "oauth/v1/token/introspect", {
				body: new URLSearchParams({
					token: token,
					client_id: this.root.options.clientId,
					client_secret: this.root.options.clientSecret
				})
			})
		)
	}

	public async resources() {
		return await this.root.request<RobloxAuthResources>("POST", "oauth/v1/token/resources", {
			body: new URLSearchParams({
				token: this.root.tokens!.access_token!,
				client_id: this.root.options.clientId,
				client_secret: this.root.options.clientSecret
			})
		})
	}
}