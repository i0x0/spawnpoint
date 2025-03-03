import type { NextApiRequest, NextApiResponse } from 'next'
import { authApi } from '@/lib/roblox-api'
import { Action } from '@/lib/roblox-api/types'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const api = await authApi(req, res)
	const perms = await api.auth.resources()
	const hasPermission = (universeId: string) => perms.resource_infos.some(x => x.resources.universe.ids.includes(universeId))
	if (hasPermission(req.body.universeId)) {
		switch (req.body.action) {
			case Action.RESTART_UNIVERSE:
				console.log(req.body)
				await api.universe.restart(req.body.universeId)
				return res.status(200).json({})
			case Action.PUBLISH_UNIVERSE:
				await api.universe.publish(req.body.universeId, req.body.data)
				return res.status(200).json({})
		}
	} else {
		return res.status(403).json({ error: "NO_PERMISSION" })
	}
}