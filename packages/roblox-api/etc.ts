import Prototype from "./prototype";

export type RobloxGroup = {
	path: string
	createTime: string
	updateTime: string
	id: string
	displayName: string
	description: string
	owner: `users/${string}`
	memberCount: number
	publicEntryAllowed: boolean
	locked: boolean
	verified: boolean
}

export type RobloxUser = {
	path: string
	createTime: string
	id: string
	name: string
	displayName: string
	about: string
	locale: string
	premium: boolean
	idVerified: boolean
	socialNetworkProfiles: {
		facebook: string
		twitter: string
		youtube: string
		twitch: string
		guilded: string
		visibility: string
	}
}


export default class Etc extends Prototype {
	public async getGroup(id: string) {
		return await this.root.request<RobloxGroup>("GET", `/cloud/v2/groups/${id}`)
	}

	public async getUser(id: string) {
		return await this.root.request<RobloxUser>("GET", `/cloud/v2/users/${id}`)
	}
}