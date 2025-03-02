import { NextRequest, NextResponse } from "next/server";
import { cookiesAPI } from "./lib/cookies";

export function middleware(req: NextRequest) {
	const res = NextResponse.next()
	const session = cookiesAPI(req, res)

	if (session.keys) {

	}
}
