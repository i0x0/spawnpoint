"use server";
import { restartUniverse } from "@/api";

const Restart = ({ uni }: { uni: string }) => {
	return (
		<form action={() => {
			restartUniverse(uni);
		}}>
			<button className="text-white bg-green-700 px-4 py-2 rounded text-left">Restart Universe</button>
		</form>
	)
}

export default Restart