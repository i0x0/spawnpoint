import safeAwait from "safe-await"
import Image from 'next/image';
import { RobloxThumbnail } from "@/lib/roblox-api/thumbnail";
import Restart from "./Restart";
import { auth } from "@/lib/roblox-api";
//import { useCallback } from "react";

export default async function UniversePage({ params }: { params: { uni: string } }) {
	const { uni } = await params
	const api = await auth()
	const [, universe] = await safeAwait(api.universe.get(uni))
	const [, thumbnail] = await safeAwait(api.thumbnail.universe(uni))
	const [, places] = await safeAwait(api.universe.places(uni))
	const [, detail] = await safeAwait(api.games.detail(uni))
	console.log(detail)
	let thumbnails_: RobloxThumbnail | undefined
	if (places) {
		const [, thumbnails] = await safeAwait(api.thumbnail.place(places.data.map((place) => String(place.id))))
		//console.log(thumbnails)
		thumbnails_ = thumbnails
	}

	return (
		<>
			<div className="container p-4 min-w-11/12">
				<div className="flex items-center gap-4">
					{thumbnail?.data[0]?.imageUrl ? (
						<Image src={thumbnail.data[0].imageUrl} alt={universe?.displayName || ''} width={128} height={128} className="rounded-lg" priority unoptimized />
					) : (
						<div className="w-32 h-32 rounded-lg bg-gray-200 animate-pulse" />
					)}
					<div>
						<h1 className="text-2xl font-medium">{universe?.displayName}</h1>
						<p className="text-gray-400 pb-3">{universe?.description}</p>
						<div className="flex items-center gap-4">
							<Restart uni={uni} />
							<p className="ml-2">{detail?.data[0].playing} active players</p>
							<p className="ml-2">{detail?.data[0].visits} total visits</p>
							<p className="ml-2">{detail?.data[0].favoritedCount} favorites</p>

						</div>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-8 mt-4">
					<div className="flex flex-col gap-2">
						<h2 className="text-xl font-medium">Places</h2>
						<div className="grid grid-cols-2 gap-4 py-3">
							{places?.data.map((place) => (
								<div key={place.id} className="group flex flex-col w-65 border border-gray-700 rounded-lg p-4 bg-[#111111] relative hover:border-gray-500 transition-all cursor-pointer">
									<div className="absolute top-2 right-2 transition-opacity z-10">
										<div className="relative">
											<button className="text-white hover:text-gray-200 peer">
												<svg xmlns="http://www.w3.org/2000/svg" width="20" height="32" viewBox="0 0 24 32" fill="currentColor">
													<circle cx="12" cy="8" r="2.5" />
													<circle cx="12" cy="18" r="2.5" />
													<circle cx="12" cy="28" r="2.5" />
												</svg>
											</button>
											<div className="hidden peer-focus:flex hover:flex absolute right-0 mt-2 w-48 flex-col bg-[#111111] rounded-lg shadow-lg p-2 z-20">
												<button className="text-white hover:bg-gray-600 px-4 py-2 rounded text-left">Edit Place</button>
												<button className="text-white hover:bg-gray-600 px-4 py-2 rounded text-left">View Details</button>
												<button className="text-red-400 hover:bg-gray-600 px-4 py-2 rounded text-left">Remove Place</button>
											</div>
										</div>
									</div>
									<img
										src={thumbnails_?.data.find((thumbnail) => thumbnail.targetId === place.id)?.imageUrl}
										alt={place.name}
										width={150}
										height={150}
										className="w-40 h-40 object-cover rounded-lg mx-auto transition-transform"
									/>
									<div className="mt-3">
										<div className="font-medium text-sm text-center text-white truncate">{place.name}</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<h2 className="text-xl font-medium">Statistics</h2>
						<div className="border border-gray-700 rounded-lg p-4 bg-[#111111]">
							<p className="text-gray-300">Universe statistics will appear here</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}