import { authRequired } from "@/api"
import Image from "next/image"
import Link from "next/link"
import { RobloxUser } from "@/lib/roblox-api/etc"
import safeAwait from "safe-await"


export default async function GroupPage({ params }: { params: { id: string } }) {
	const { id } = await params
	const api = await authRequired()

	if (id.startsWith("p-")) {
		// Handle personal group case
		const userId = id.slice(2) // Remove "p-" prefix
		const [err, user] = await safeAwait(api.etc.getUser(userId))
		const [err2, resources] = await safeAwait(api.thumbnail.user(userId))

		if (err || err2) {
			console.error(err)
		}

		return (
			<div className="container p-4">
				<div className="flex gap-4">
					{resources ? (
						<Image
							src={resources.data[0].imageUrl}
							alt="User thumbnail"
							className="w-32 h-32 rounded-lg"
							width={128}
							height={128}
							priority
							unoptimized
						/>
					) : (
						<div className="w-32 h-32 rounded-lg bg-neutral-800 animate-pulse" />
					)}
					<div>
						<h1 className="text-2xl font-medium flex items-baseline gap-1">
							{user?.displayName}'s Group (fake group)
							<a href={`https://www.roblox.com/users/${user?.id}/profile`}>
								<span className="text-sm text-gray-400">
									- {user?.displayName}
								</span>
							</a>
						</h1>
						<p className="text-gray-400">Personal group space for {user?.displayName}</p>
					</div>
				</div>
			</div>
		)
	}

	// Handle regular group case
	const [err, group] = await safeAwait(api.etc.getGroup(id))
	const [err2, resources] = await safeAwait(api.thumbnail.group(id))
	let User: RobloxUser | null = null

	if (err || err2) {
		console.error(err)
	} else {
		if (group) {
			const [err3, user] = await safeAwait(api.etc.getUser(group?.owner.split("/")[1]))
			if (err3) {
				console.error(err3)
			} else {
				//console.log(user)
				User = user
			}
		}
	}

	return (
		<div className="container p-4">
			<div className="flex gap-4">
				{resources ? (
					<Image
						src={resources.data[0].imageUrl}
						alt="Group thumbnail"
						className="w-32 h-32 rounded-lg"
						width={128}
						height={128}
						priority
						unoptimized
					/>
				) : (
					<div className="w-32 h-32 rounded-lg bg-neutral-800 animate-pulse" />
				)}
				<div>
					<h1 className="text-2xl font-medium flex items-baseline gap-1">
						{group?.displayName}
						{User !== null ? (
							<Link href={`https://www.roblox.com/users/${User.id}/profile`}>
								<span className="text-sm text-gray-400">
									- {User.displayName}
								</span>
							</Link>
						) : null}
					</h1>
					<p className="text-gray-400">{group?.description?.split('\n').map((line, i) => (
						<span key={i}>
							{line}
							<br />
						</span>
					))}</p>
					<p className="text-gray-400"></p>
				</div>
			</div>
		</div>
	)
}