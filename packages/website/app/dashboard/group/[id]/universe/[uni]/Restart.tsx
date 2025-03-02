"use client";

import ky from "ky";

//import { restartUniverse } from "@/idk";

const Restart = ({ uni }: { uni: string }) => {
	const restart = async () => {
		await ky.post('/api/action', {
			json: {
				action: "RESTART_UNIVERSE",
				universeId: uni
			},
			cache: "no-store"
		})

	}

	console.log("restarting")
	return (
		<button className="text-white bg-green-700 px-4 py-2 rounded text-left" onClick={restart}>Restart Universe</button>
	)
}

export default Restart