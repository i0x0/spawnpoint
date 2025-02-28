import { COOKIE } from './const';
import { getIronSession } from 'iron-session';
import { cookies as c } from "next/headers";
import ky from 'ky';
//import { newAPI } from 'roblox-api/index';
//import { NextApiRequest, NextApiResponse } from 'next';

export type RobloxStatus = {
	result: {
		status_overall: {
			updated: string
			status: string
			status_code: number
		}
		status: Array<{
			id: string
			name: string
			status: string
			status_code: number
			containers: Array<{
				id: string
				name: string
				updated: string
				status: string
				status_code: number
			}>
			updated: string
		}>
		incidents: Array<{
			name: string
			_id: string
			datetime_open: string
			messages: Array<{
				details: string
				state: number
				status: number
				datetime: string
			}>
			containers_affected: Array<{
				name: string
				_id: string
			}>
			components_affected: Array<{
				name: string
				_id: string
			}>
		}>
		maintenance: {
			active: Array<unknown>
			upcoming: Array<unknown>
		}
	}
}

// error states
//const ROBLOX_STATUS_URL = 'https://web.archive.org/web/20240716012240if_/http://hostedstatus.com/1.0/status/59db90dbcdeb2f04dadcf16d'
const ROBLOX_STATUS_URL = 'http://hostedstatus.com/1.0/status/59db90dbcdeb2f04dadcf16d'



// @ts-expect-error uhh

export const cookiesAPI = async (req, res) => await getIronSession<Record<string, unknown>>(req, res, { password: process.env.SECRET!, cookieName: COOKIE });

// @ts-expect-error bc i said so

export const cookies = async (x: typeof c) => await getIronSession<Record<string, unknown>>(x, { password: process.env.SECRET!, cookieName: COOKIE });

export const robloxStatusCheck = async () => {
	const status = await ky(ROBLOX_STATUS_URL).json<RobloxStatus>();
	if (status.result.status_overall.status === "Operational") {
		return true
	} else {
		if (status.result.incidents.length >= 1) {
			const x: {
				components: string[],
				date: string
			} = {
				components: [],
				date: ""
			}
			status.result.incidents.forEach(i => {
				i.components_affected.forEach(c => {
					x.components.push(c.name)
				})
				x.date = i.datetime_open
			})
			return x
		}
	}

}


