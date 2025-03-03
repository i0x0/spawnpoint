import Prototype from "./prototype"

export type GameDetail = {
	data: Array<{
		id: number
		rootPlaceId: number
		name: string
		description: string
		sourceName: string
		sourceDescription: string
		creator: {
			id: number
			name: string
			type: string
			isRNVAccount: boolean
			hasVerifiedBadge: boolean
		}
		price: number
		allowedGearGenres: Array<string>
		allowedGearCategories: Array<string>
		isGenreEnforced: boolean
		copyingAllowed: boolean
		playing: number
		visits: number
		maxPlayers: number
		created: string
		updated: string
		studioAccessToApisAllowed: boolean
		createVipServersAllowed: boolean
		universeAvatarType: number
		genre: string
		genre_l1: string
		genre_l2: string
		isAllGenre: boolean
		isFavoritedByUser: boolean
		favoritedCount: number
		licenseDescription: string
		refundLink: string
		localizedFiatPrice: string
		refundPolicy: {
			policyText: string
			learnMoreBaseUrl: string
			locale: string
			articleId: string
		}
	}>
}


export default class Games extends Prototype {
	url: string = "https://games.roblox.com"

	public async detail(id: string) {
		return await this.root.request<GameDetail>("GET", `${this.url}/v1/games`, {
			prefixUrl: '',
			searchParams: {
				universeIds: [id]
			}
		})
	}

}