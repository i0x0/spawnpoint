"use server"

import { getIronSession } from "iron-session";
import { COOKIE } from "./const";

// @ts-expect-error uhhh


export const cookiesAPI = async (req, res) => await getIronSession<Record<string, unknown>>(req, res, { password: process.env.SECRET!, cookieName: COOKIE });

// @ts-expect-error bc i said so

export const cookies = async (x: typeof c) => await getIronSession<Record<string, unknown>>(x, { password: process.env.SECRET!, cookieName: COOKIE });