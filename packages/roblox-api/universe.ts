import Prototype from "./prototype";

export type RobloxUniverse = {
	path: string
	createTime: string
	updateTime: string
	displayName: string
	description: string
	user: string
	visibility: string
	facebookSocialLink: {
		title: string
		uri: string
	}
	twitterSocialLink: {
		title: string
		uri: string
	}
	youtubeSocialLink: {
		title: string
		uri: string
	}
	twitchSocialLink: {
		title: string
		uri: string
	}
	discordSocialLink: {
		title: string
		uri: string
	}
	robloxGroupSocialLink: {
		title: string
		uri: string
	}
	guildedSocialLink: {
		title: string
		uri: string
	}
	voiceChatEnabled: boolean
	ageRating: string
	privateServerPriceRobux: string
	desktopEnabled: boolean
	mobileEnabled: boolean
	tabletEnabled: boolean
	consoleEnabled: boolean
	vrEnabled: boolean
}

export type RobloxPlaces = {
	previousPageCursor: any
	nextPageCursor: any
	data: Array<{
		id: number
		universeId: number
		name: string
		description: string
	}>
}



export default class Universe extends Prototype {
	public url = "https://develop.roblox.com"

	public async get(id: string) {
		return await this.root.request<RobloxUniverse>("GET", `/cloud/v2/universes/${id}`)
	}

	public async restart(id: string) {
		return await this.root.request<{}>("POST", `/cloud/v2/universes/${id}:restartServers`)
	}

	public async places(id: string) {
		return await this.root.request<RobloxPlaces>("GET", `${this.url}/v1/universes/${id}/places`, {
			params: {
				isUniverseCreation: false,
				limit: 100,
				sortOrder: "Asc"
			}
		})
	}
}