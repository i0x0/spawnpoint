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
			prefixUrl: '',
			params: {
				format: "png",
				size: "420x420",
				groupIds: [id],
			}
		})
	}

	public async user(id: string) {
		return await this.root.request<RobloxThumbnail>("GET", `${this.url}/v1/users/avatar-headshot`, {
			prefixUrl: '',
			searchParams: {
				format: "png",
				size: "420x420",
				userIds: [id] as unknown as undefined,
			}
		})
	}

	public async universe(id: string) {
		return await this.root.request<RobloxThumbnail>("GET", `${this.url}/v1/games/icons`, {
			prefixUrl: '',
			searchParams: {
				format: "png",
				size: "420x420",
				universeIds: [id] as unknown as undefined,
			}
		})
	}

	public async place(id: string[]) {
		return await this.root.request<RobloxThumbnail>("GET", `${this.url}/v1/places/gameicons`, {
			prefixUrl: '',
			searchParams: {
				format: "png",
				size: "420x420",
				placeIds: id,
			}
		})
	}
}