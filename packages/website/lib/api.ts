import { COOKIE } from './const';
import { getIronSession } from 'iron-session';
import { cookies as c } from "next/headers";
import ky from 'ky';
//import { newAPI } from 'roblox-api/index';
import safeAwait from 'safe-await';
import { RobloxApi, TokenResponse } from '@/roblox-api';
import { prisma } from './prisma';
//import { Issuer, custom } from 'openid-client';
import { redirect } from 'next/navigation';
import { Action } from '@/pages/api/action';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

let cachedApi: RobloxApi | null = null;

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

export const authRequired = async () => {
	//console.log("authRequired, cachedApi: ", cachedApi)
	if (cachedApi) {
		return cachedApi;
	}
	const [e, _cookies] = await safeAwait(c());
	if (e) {
		// idk
	}
	const [e_, session] = await safeAwait(cookies(_cookies as unknown as () => Promise<ReadonlyRequestCookies>))
	if (e_) {
		console.log("uhh")
		// still dont know 
	}

	if (!session?.id) {
		// def redirect
		redirect('/')
	}

	const data = await prisma.user.findUnique({
		where: {
			id: session!.id! as unknown as string
		}
	})

	cachedApi = new RobloxApi({
		token: data!.data! as unknown as TokenResponse,
		clientId: process.env.ROBLOX_ID!,
		clientSecret: process.env.ROBLOX_SECRET!,
		//id: data!.id
	})
	return cachedApi
}

export const restartUniverse = async (uni: string) => {
	await fetch("/api/action", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			action: Action.RESTART_UNIVERSE,
			universeId: uni
		}),
		cache: "no-store"
	})
}