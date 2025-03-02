declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ROBLOX_ID: string
			ROBLOX_SECRET: string
			[key: string]: string | undefined
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { }
