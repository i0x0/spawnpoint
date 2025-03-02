import type { NextApiRequest, NextApiResponse } from 'next'
import { authRequiredApi } from "@/api_"
//import { Action } from '@/roblox-api/types'


export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const api = await authRequiredApi(req, res)
	const perms = await api.auth.resources()
	switch (req.body.action) {
		case "RESTART_UNIVERSE":
			console.log(perms.resource_infos)
			if (perms.resource_infos.some(x => x.resources.universe.ids.includes(req.body.universeId))) {
				console.log(req.body)
				await api.universe.restart(req.body.universeId)
				return res.status(200).json({})
			} else {
				return res.status(403).json({ error: "You do not have permission to restart this universe" })
			}
			break
	}
}