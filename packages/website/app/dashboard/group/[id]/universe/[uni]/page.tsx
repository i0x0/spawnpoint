import { authRequired, restartUniverse } from "@/api"
import safeAwait from "safe-await"
import Image from 'next/image';
import { RobloxThumbnail } from "@/lib/roblox-api/thumbnail";
import { useCallback } from "react";

export default async function UniversePage({ params }: { params: { uni: string } }) {
	const { uni } = await params
	const api = await authRequired()
	const [, universe] = await safeAwait(api.universe.get(uni))
	const [, thumbnail] = await safeAwait(api.thumbnail.universe(uni))
	const [, places] = await safeAwait(api.universe.places(uni))
	let thumbnails_: RobloxThumbnail | undefined
	if (places) {
		const [, thumbnails] = await safeAwait(api.thumbnail.place(places.data.map((place) => String(place.id))))
		//console.log(thumbnails)
		thumbnails_ = thumbnails
	}

	const restart = useCallback(async () => {
		const api = await authRequired()
	}, [])

	//console.log(places)
	return (
		<>
			<div className="container p-4">
				<div className="flex items-center gap-4">
					{thumbnail?.data[0]?.imageUrl ? (
						<Image src={thumbnail.data[0].imageUrl} alt={universe?.displayName || ''} width={128} height={128} className="rounded-lg" priority unoptimized />
					) : (
						<div className="w-32 h-32 rounded-lg bg-gray-200 animate-pulse" />
					)}
					<div>
						<h1 className="text-2xl font-medium">{universe?.displayName}</h1>
						<p className="text-gray-400">{universe?.description}</p>
						{/*<Restart uni={uni} />*/}

						<button className="text-white bg-green-700 px-4 py-2 rounded text-left" onClick={async () => {
							"use server";
							console.log("i", uni)
							const api = await authRequired()

							//restartUniverse(uni)
							api.universe.restart(uni).then((res) => {
								if (res.status === 200) {
									console.log("Restarted universe")
									//window.location.reload()
								}
							}).catch((err) => {
								console.log("Error restarting universe", err)
								//router.push(`/dashboard/group/${groupId}/universe/${uni}`)
							})
						}}>Restart Universe</button>

					</div>
					<div>
					</div>
				</div>
				<div className="flex flex-col gap-2 mt-4">
					<h2 className="text-xl font-medium">Places</h2>
					<div className="flex flex-row gap-4 flex-wrap">
						{places?.data.map((place) => (
							<div key={place.id} className="group flex flex-col w-48 border border-gray-700 rounded-lg p-4 bg-[#111111] relative hover:border-gray-500 transition-all cursor-pointer">
								<div className="absolute top-2 right-2  transition-opacity z-10">
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
			</div>
		</>
	)
}