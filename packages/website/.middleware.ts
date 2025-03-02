import { cookiesAPI } from '@/api';
import { robloxClient, TokenResponse } from '@/roblox-api';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TokenSet } from 'openid-client';
import safeAwait from 'safe-await';

export const middleware = async (req: NextRequest) => {
	if (req.nextUrl.pathname.startsWith('/dashboard')) {
		const [err, s] = await safeAwait(cookiesAPI(req, new Response()))
		if (err) { }
		try {
			if (!s) {
				return NextResponse.redirect(new URL('/', req.url))
			} else {
				const t = new TokenSet(s.data as unknown as TokenResponse)
				if (t.expired()) {
					try {
						const newTokens = await robloxClient.refresh(t);
						console.log(newTokens)
					} catch (e) {
						console.error("failed to refresh token", e)
					}
				}
			}
		} catch (e) {
			console.error("failed to refresh token", e)
		}
	}
	return NextResponse.next()

}

export const config = {
	matcher: '/dashboard/:path*'
}
