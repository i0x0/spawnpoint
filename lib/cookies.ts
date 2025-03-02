import { getIronSession } from "iron-session";
import type { NextApiRequest, NextApiResponse } from "next";
import { COOKIE } from "@/lib/const"
import type { cookies as c } from "next/headers";
import type { CookieListItem } from "next/dist/compiled/@edge-runtime/cookies";
import type { NextRequest, NextResponse } from "next/server";

// @ts-expect-error too much type sanity
import type { CookieSerializeOptions } from 'cookie';

type ResponseCookie = CookieListItem & Pick<CookieSerializeOptions, "httpOnly" | "maxAge" | "priority">;


interface CookieStore {
	get: (name: string) => {
		name: string;
		value: string;
	} | undefined;
	set: {
		(name: string, value: string, cookie?: Partial<ResponseCookie>): void;
		(options: ResponseCookie): void;
	};
}

export const cookiesAPI = async (req: NextApiRequest | NextRequest, res: NextApiResponse | NextResponse) => await getIronSession<Record<string, string | unknown>>(req, res, { password: process.env.SECRET!, cookieName: COOKIE });



export const cookies = async (x: typeof c) => await getIronSession<Record<string, string | unknown>>(x as unknown as CookieStore, { password: process.env.SECRET!, cookieName: COOKIE });