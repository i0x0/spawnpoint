import * as client from 'openid-client'
import { COOKIE, ROBLOX } from './const';
import { getIronSession } from 'iron-session';
import { cookies as c } from "next/headers";


export const config = await client.discovery(new URL(ROBLOX.issuer), process.env.ROBLOX_ID!, {})

// @ts-expect-error uhh

export const cookiesAPI = async (req, res) => await getIronSession<Record<string, unknown>>(req, res, { password: process.env.SECRET!, cookieName: COOKIE });

// @ts-expect-error bc i said so

export const cookies = async (x: typeof c) => await getIronSession<Record<string, unknown>>(x, { password: process.env.SECRET!, cookieName: COOKIE });