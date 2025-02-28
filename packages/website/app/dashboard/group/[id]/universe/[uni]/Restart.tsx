"use client";

import { Action } from "@/api_";

//import { restartUniverse } from "@/idk";

const Restart = ({ uni }: { uni: string }) => {
	const restart = async () => {
		await fetch("/api/action", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				action: "RESTART_UNIVERSE",
				universeId: uni
			}),
			cache: "no-store"
		})
	}

	console.log("restarting")
	return (
		<button className="text-white bg-green-700 px-4 py-2 rounded text-left" onClick={restart}>Restart Universe</button>
	)
}

export default Restart