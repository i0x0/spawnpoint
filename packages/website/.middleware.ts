import { COOKIE, SCOPES } from '@/const';
import { prisma } from '@/prisma';
import { robloxClient, TokenResponse } from '@/roblox-api';
import { getIronSession } from 'iron-session';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Issuer, TokenSet, custom } from 'openid-client';

export async function middleware(request: NextRequest) {
	// Check if the path starts with /dashboard
	if (request.nextUrl.pathname.startsWith('/dashboard')) {
		const s = await getIronSession<Record<string, unknown>>(request.cookies, { password: process.env.SECRET!, cookieName: COOKIE });
		prisma.user.findUnique({
			where: {
				id: s.id
			}
		}).then(async (u) => {
			if (!u) {
				return NextResponse.redirect(new URL('/', request.url))
			} else {
				const t = new TokenSet(s.data as unknown as TokenResponse)
				if (t.expired()) {
					try {
						console.log(process.version)
						const newTokens = await robloxClient.refresh(t);
						console.log(newTokens)
					} catch (e) {
						console.error("failed to refresh token", e)
					}
				}
			}
		})
		//console.log(s)
	}

	return NextResponse.next()
}

export const config = {
	matcher: '/dashboard/:path*'
}
