import safeAwait from "safe-await"
import Image from 'next/image';
import { RobloxThumbnail } from "@/lib/roblox-api/thumbnail";
import { auth } from "@/lib/roblox-api";
import Actions from "./Actions";
//import { useCallback } from "react";

export default async function UniversePage({ params }: { params: Promise<{ uni: string }> }) {
	const { uni } = await params
	const api = await auth()
	const [, universe] = await safeAwait(api.universe.get(uni))
	const [, thumbnail] = await safeAwait(api.thumbnail.universe(uni))
	const [, places] = await safeAwait(api.universe.places(uni))
	const [, detail] = await safeAwait(api.games.detail(uni))
	const [, datastore] = await safeAwait(api.datastore.list(uni))
	console.log("d", datastore)
	let thumbnails_: RobloxThumbnail | undefined
	if (places) {
		const [, thumbnails] = await safeAwait(api.thumbnail.place(places.data.map((place) => String(place.id))))
		//console.log(thumbnails)
		thumbnails_ = thumbnails
	}

	return (
		<div className="container p-8 min-w-11/12">
			<div className="flex items-start gap-8 mb-12">
				{thumbnail?.data[0]?.imageUrl ? (
					<Image src={thumbnail.data[0].imageUrl} alt={universe?.displayName || ''} width={192} height={192} className="rounded-xl shadow-lg" priority unoptimized />
				) : (
					<div className="w-48 h-48 rounded-xl bg-gray-900/50 animate-pulse" />
				)}
				<div className="flex-1">
					<h1 className="text-4xl font-bold mb-3">{universe?.displayName}</h1>
					<p className="text-gray-400 text-lg mb-6 leading-relaxed">{universe?.description}</p>
					<div className="flex items-center gap-8">
						<div className="flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
								<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
							</svg>
							<span>{detail?.data[0].playing}</span>
						</div>
						<div className="flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
							</svg>
							<span>{detail?.data[0].visits}</span>
						</div>
						<div className="flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
							<span>{detail?.data[0].favoritedCount}</span>
						</div>
						<div className="group ">
							<button className="bg-gray-900 hover:bg-gray-800 px-6 py-2.5 rounded-lg font-medium transition-colors">
								Actions
							</button>
							<div className="group-hover:block absolute hidden">
								<ul className="mt-2 w-56 bg-gray-900 shadow-xl rounded-xl p-2 ">
									<Actions uni={uni} />
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-12">
				<div>
					<h2 className="text-2xl font-bold mb-6">Places</h2>
					<div className="grid grid-cols-3 gap-4">
						{places?.data.map((place) => (
							<div key={place.id} className="group relative bg-gray-900/50 rounded-lg p-2 hover:bg-gray-900 transition-colors">
								<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
									<div className="relative">
										<button className="text-white/75 hover:text-white peer p-1">
											<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
												<circle cx="12" cy="6" r="2" />
												<circle cx="12" cy="12" r="2" />
												<circle cx="12" cy="18" r="2" />
											</svg>
										</button>
										<div className="hidden peer-focus:flex hover:flex absolute right-0 mt-2 w-40 flex-col bg-gray-900 rounded-xl shadow-xl overflow-hidden z-20">
											<button className="px-3 py-1.5 text-sm text-left hover:bg-gray-800 transition-colors">Edit Place</button>
											<button className="px-3 py-1.5 text-sm text-left hover:bg-gray-800 transition-colors">View Details</button>
											<button className="px-3 py-1.5 text-sm text-left text-red-400 hover:bg-gray-800 transition-colors">Remove Place</button>
										</div>
									</div>
								</div>
								<img
									src={thumbnails_?.data.find((thumbnail) => thumbnail.targetId === place.id)?.imageUrl}
									alt={place.name}
									width={120}
									height={120}
									className="w-full h-52 object-cover rounded-lg mb-2 group-hover:scale-[1.02] transition-transform"
								/>
								<h3 className="font-medium text-xs text-center text-white/90 truncate px-1">{place.name}</h3>
							</div>
						))}
					</div>
				</div>

				<div>
					<h2 className="text-2xl font-bold mb-6">Statistics</h2>
					<div className="bg-gray-900/50 rounded-xl p-6">
						<p className="text-gray-400">Universe statistics will appear here</p>
					</div>
				</div>
			</div>
		</div>
	)
}