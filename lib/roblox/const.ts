export const SCOPES = [
	"openid",
	"profile",
	"group:read",
	"legacy-group:manage",
	"user.social:read",
	"universe:write",
	"legacy-universe:manage",
	"universe-messaging-service:publish",
	"legacy-team-collaboration:manage",
	//"universe-datastores.control:list",
	//"universe-datastores.objects:read",
	//"universe-datastores.objects:create",
	//"universe-datastores.objects:delete",
	//"universe-datastores.objects:update",
	//"universe.memory-store.queue:write",
	//"universe.memory-store.queue:discard",
	//"universe.memory-store.queue:dequeue",
	//"universe.place.luau-execution-session:read",
	//"universe.place.luau-execution-session:write"
].join(" ")

export const ROBLOX_OAUTH = "https://apis.roblox.com/oauth/.well-known/openid-configuration"
