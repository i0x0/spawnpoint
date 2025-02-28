import type { NextApiRequest, NextApiResponse } from 'next'
import { Action, authRequiredApi } from "@/api_"


export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const api = await authRequiredApi(req, res)
	const perms = await api.auth.resources()
	switch (req.body.action) {
		case Action.RESTART_UNIVERSE:
			if (perms.resource_infos.some(x => x.resources.universe.ids.includes(req.body.universeId))) {
				await api.universe.restart(req.body.universeId)
			} else {
				return res.status(403).json({ error: "You do not have permission to restart this universe" })
			}
			break
	}
}