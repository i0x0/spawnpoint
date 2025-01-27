export const ROBLOX = {
	"issuer": "https://apis.roblox.com/oauth/",
	"authorization_endpoint": "https://apis.roblox.com/oauth/v1/authorize",
	"token_endpoint": "https://apis.roblox.com/oauth/v1/token",
	"introspection_endpoint": "https://apis.roblox.com/oauth/v1/token/introspect",
	"revocation_endpoint": "https://apis.roblox.com/oauth/v1/token/revoke",
	"resources_endpoint": "https://apis.roblox.com/oauth/v1/token/resources",
	"userinfo_endpoint": "https://apis.roblox.com/oauth/v1/userinfo",
	"jwks_uri": "https://apis.roblox.com/oauth/v1/certs",
	"registration_endpoint": "https://create.roblox.com/dashboard/credentials",
	"service_documentation": "https://create.roblox.com/docs/reference/cloud",
	"scopes_supported": [
		"openid",
		"profile",
		"email",
		"verification",
		"credentials",
		"age",
		"premium",
		"roles"
	],
	"response_types_supported": ["none", "code"],
	"subject_types_supported": ["public"],
	"id_token_signing_alg_values_supported": ["ES256"],
	"claims_supported": [
		"sub",
		"type",
		"iss",
		"aud",
		"exp",
		"iat",
		"nonce",
		"name",
		"nickname",
		"preferred_username",
		"created_at",
		"profile",
		"email",
		"email_verified",
		"verified",
		"age_bracket",
		"premium",
		"roles",
		"internal_user"
	],
	"token_endpoint_auth_methods_supported": [
		"client_secret_post",
		"client_secret_basic"
	]
}

export const SCOPES = "openid profile group:read legacy-group:manage user.social:read universe:write legacy-universe:manage"

export const COOKIE = "idk_tbh"