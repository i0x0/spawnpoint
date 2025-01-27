import { authRequired } from "@/api"
import safeAwait from "safe-await"
import Image from 'next/image';

export default async function UniversePage({ params }: { params: { uni: string } }) {
	const { uni } = await params
	const api = await authRequired()
	const [, universe] = await safeAwait(api.universe.get(uni))
	const [, thumbnail] = await safeAwait(api.thumbnail.universe(uni))
	return (
		<div className="container p-4">
			<div className="flex items-center gap-4">
				{thumbnail?.data[0].imageUrl ? (
					<img src={thumbnail.data[0].imageUrl} alt={universe?.displayName} width={128} height={128} className="rounded-lg" />
				) : (
					<div className="w-32 h-32 rounded-lg bg-gray-200 animate-pulse" />
				)}
				<div>
					<h1 className="text-2xl font-medium">{universe?.displayName}</h1>
					<p className="text-gray-400">{universe?.description}</p>

				</div>
			</div>
		</div>
	)
}