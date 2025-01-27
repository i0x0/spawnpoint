import { authRequired } from "@/api"
import safeAwait from "safe-await"
import DropdownMenu, { MenuItem } from "@/components/DropdownMenu"
import _ from "lodash"
export default async function BlogLayout({
	children,
	params,
}: {
	children: React.ReactNode,
	params: { id: string }
}) {
	const { id } = await params
	const api = await authRequired()
	const [err, _resources] = await safeAwait(api.auth.resources())
	const resources: MenuItem[] = []
	let ready = false
	if (err) {
		console.error(err)
	} else {
		let _id = id
		if (id.startsWith("p-")) {
			_id = id.slice(2)
		}
		const resource = _resources.resource_infos.find(r => r.owner.id === _id)
		//console.log(resource)
		for (const uniId of resource?.resources.universe.ids ?? []) {
			const [err, universe] = await safeAwait(api.universe.get(uniId))
			if (err) {
				console.error(err)
			} else {
				//console.log(universe)
				resources.push({
					label: `${universe.displayName} - (${uniId})`,
					href: `/dashboard/group/${id}/universe/${uniId}`,
				})
			}
		}
	}
	ready = true

	return (
		<div className="h-svh min-w-full max-w-full">
			<div className="w-full h-16 bg-[#101010] border-b border-neutral-800 flex items-center px-4 z-50">
				<h1 className="text-xl font-medium"></h1>
				{ready && <DropdownMenu items={resources} />}
			</div>
			{children}
		</div>
	)
}