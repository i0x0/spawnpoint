export type RobloxAuthRefresh = {
	access_token: string
	refresh_token: string
	token_type: "Bearer"
	expires_in: number
	scope: string
}

export type RobloxUserInfo = {
	sub: string
	name: string
	nickname: string
	preferred_username: string
	created_at: number
	profile: string
	picture: string
}

export type RobloxAuthIntrospect = {
	active: boolean
	jti: string
	iss: string
	token_type: string
	client_id: string
	aud: string
	sub: string
	scope: string
	exp: number
	iat: number
}
