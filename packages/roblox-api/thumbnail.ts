import Prototype from "./prototype";

export type RobloxThumbnail = {
	data: Array<{
		targetId: number
		state: string
		imageUrl: string
		version: string
	}>
}


export default class Thumbnail extends Prototype {
	url: string = "https://thumbnails.roblox.com"
	public async group(id: string) {
		return await this.root.request<RobloxThumbnail>("GET", `${this.url}/v1/groups/icons`, {
			params: {
				format: "png",
				size: "420x420",
				groupIds: [id],
			}
		})
	}

	public async user(id: string) {
		return await this.root.request<RobloxThumbnail>("GET", `${this.url}/v1/users/avatar-headshot`, {
			params: {
				format: "png",
				size: "420x420",
				userIds: [id],
			}
		})
	}

	public async universe(id: string) {
		return await this.root.request<RobloxThumbnail>("GET", `${this.url}/v1/games/icons`, {
			params: {
				format: "png",
				size: "420x420",
				universeIds: [id],
			}
		})
	}
}