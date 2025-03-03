"use client";

import ky from "ky";
import { toast } from "react-toastify";

//import { restartUniverse } from "@/idk";

const Restart = ({ uni }: { uni: string }) => {
	const restart = async () => {
		toast.promise(
			ky.post('/api/action', {
				json: {
					action: "RESTART_UNIVERSE",
					universeId: uni
				},
				cache: "no-store"
			}), {
			pending: "telling roblox to restart",
			success: "restarted",
			error: "something wrong happened3"
		}
		)
	}

	return (
		<button className="text-white bg-green-700 px-4 py-2 rounded text-left" onClick={restart}>Restart Universe</button>
	)
}

export default Restart