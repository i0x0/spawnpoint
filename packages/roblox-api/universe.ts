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


export default class Universe extends Prototype {
	public async get(id: string) {
		return await this.root.request<RobloxUniverse>("GET", `/cloud/v2/universes/${id}`)
	}
}