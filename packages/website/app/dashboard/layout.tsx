import safeAwait from 'safe-await';
import AnimatedGrid from '@/components/AnimatedGrid';
import { authRequired } from '@/auth';
//import { useRouter } from 'next/navigation';
import DropdownMenu, { MenuItem } from '@/components/DropdownMenu';
import Link from 'next/link';
import { HyperText } from '@/components/ui/hyper-text';
import Image from 'next/image';

export default async function BlogLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const api = await authRequired()
	const [, user] = await safeAwait(api.user.self())
	const [err, _resources] = await safeAwait(api.auth.resources())
	if (err) {
		console.log("err5", err)
		//console.error(err)
	}
	let ready = false
	const resources: MenuItem[] = []
	if (_resources !== undefined) {
		for (const resource of _resources.resource_infos) {
			if (resource.owner.type === 'Group') {
				const [err, group] = await safeAwait(api.etc.getGroup(resource.owner.id))
				const [err2, thumbnail] = await safeAwait(api.thumbnail.group(resource.owner.id))
				if (err2) {
					console.error(err2)
				} else {
					//console.log("thumbnail: ", thumbnail)
				}
				//console.log(group)
				if (err) {
					console.error(err)
				} else {
					resources.push({
						label: group.displayName,
						href: `/dashboard/group/${group.id}`,
						icon: thumbnail?.data[0] ? (
							<Image src={thumbnail.data[0].imageUrl} alt={group.displayName} className="w-4 h-4 rounded-full" priority={true} width={10} height={10} unoptimized />
						) : undefined,
					})
				}
			} else if (resource.owner.type === 'User') {
				const [err, user] = await safeAwait(api.etc.getUser(resource.owner.id))
				const [err2, thumbnail] = await safeAwait(api.thumbnail.user(resource.owner.id))
				if (err2) {
					console.error(err2)
				} else {
					//console.log("thumbnail: ", thumbnail)
				}
				if (err) {
					console.error(err)
				} else {
					resources.push({
						label: `${user.displayName}'s Group`,
						href: `/dashboard/group/p-${user.id}`,
						icon: thumbnail?.data[0] ? (
							<Image src={thumbnail.data[0].imageUrl} alt={user.displayName} className="w-4 h-4 rounded-full" priority={true} width={10} height={10} unoptimized />
						) : undefined,
					})
				}
			}
		}
		ready = true
	}
	//console.log(JSON.stringify(_resources, null, 2))

	return (
		<>
			<div className="fixed bg-[#101010] h-svh w-screen overflow-hidden -z-[1]">
				<AnimatedGrid gridSize={200} />
			</div>
			<div className="relative z-[1] flex min-h-svh">
				{/* Sidebar */}
				<div className="w-64 bg-black/50 backdrop-blur-sm border-r border-white/10 p-4 flex flex-col">
					{/* Add your sidebar content here */}
					<nav className="flex-1 flex flex-col">
						<div className="space-y-4">
							<HyperText className="text-xl text-white/80" duration={2000}>
								spawnpoint
							</HyperText>


							<div className="flex items-center gap-3">
								{user?.picture && (
									<Image
										src={user.picture}
										alt={user?.name || 'Profile'}
										className="w-10 h-10 rounded-full bg-[#d4d4d4]"
										width={10}
										height={10}
										priority={true}
										unoptimized
									/>
								)}
								<h2 className="text-xl font-semibold text-white">{user?.name}</h2>
							</div>
							<div className="flex items-center gap-3">
								{ready ? (
									<DropdownMenu items={resources} />
								) : (
									<div className="animate-pulse">
										<div className="h-10 w-full bg-white/10 rounded-lg"></div>
									</div>
								)}
							</div>
						</div>
						<div className="mt-auto">
							<Link
								href="/login"
								className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M23 4v6h-6" />
									<path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
								</svg>
								Refresh permissions
							</Link>
							<Link
								href="/api/signout"
								className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
									<polyline points="16 17 21 12 16 7" />
									<line x1="21" y1="12" x2="9" y2="12" />
								</svg>
								Sign out
							</Link>
						</div>
					</nav>
				</div>

				{/* Main Content */}
				<div className="text-white w-[calc(100%-256px)]">
					{children}
				</div>
			</div>
		</>
	)
}
