// actual hell hole

import { NextRequest, NextResponse } from "next/server";
import { cookiesAPI } from "./lib/cookies";
import { RobloxApi } from "./lib/roblox-api";
import * as client from "openid-client";
import { robloxConfig } from "./lib/roblox/utils";
import jwt from "jsonwebtoken";
import { createLogger, isJwtValid } from "./lib/utils";
import safeAwait from "safe-await";
import type { TokenResponse } from "./lib/roblox-api/types";
import * as Sentry from "@sentry/nextjs";

const log = createLogger("middleware");

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    const session = await cookiesAPI(req, res);
    log("session", session);
    if (session.keys) {
      let auth = new RobloxApi({
        tokens: session!.keys! as unknown as TokenResponse,
        clientId: process.env.ROBLOX_ID!,
        clientSecret: process.env.ROBLOX_SECRET!,
        //id: data!.id
      });

      let accessTokenCheck = await auth.auth.introspect(
        session.keys.access_token,
      );

      //let decoded = jwt.decode(auth.tokens.access_token)
      //if (decoded === null) {
      //	await session.destroy()
      //	return NextResponse.redirect(new URL('/', req.url))
      //}
      ////console.log("Ff", auth.tokens)
      //if (isJwtValid(decoded!.exp)) {
      if (accessTokenCheck.active) {
        log("good token");
        // access token still good
        const soon = 6 * 60 * 1000; // 5 minutes in milliseconds
        //const isExpiringSoon = (new Date(decoded!.exp * 1000).getTime() - Date.now()) <= soon;
        const isExpiringSoon =
          new Date(accessTokenCheck.exp * 1000).getTime() - Date.now() <= soon;
        if (isExpiringSoon) {
          log("expiring");
          const [err, newTokens] = await safeAwait(
            client.refreshTokenGrant(robloxConfig, session.keys.refresh_token!),
          );
          if (err) {
            console.error(err);
          }
          session.keys = newTokens!;
          session.refreshed = session.refreshed + 1 || 1;
          await session.save();
        }
      } else {
        log("bad token");
        log(session.keys);
        let [err, refreshTokenCheck] = await safeAwait(
          auth.auth.introspect(session.keys.refresh_token!),
        );
        if (err) {
          console.error(err);
        }
        log("r", refreshTokenCheck);
        if (refreshTokenCheck!.active === true) {
          // token still good
          log("good refresh token");
          const [err, newTokens] = await safeAwait(
            client.refreshTokenGrant(robloxConfig, session.keys.refresh_token!),
          );
          if (err) {
            console.error(err);
          }
          session.keys = newTokens!;
          session.refreshed = session.refreshed + 1 || 1;
          await session.save();
        } else {
          // token bad
          log("bad refresh token");
          delete session.keys;
          await session.save();
          if (req.nextUrl.pathname.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/login", req.url));
          } else {
            log("here");
            //session.fff = "h"
          }
        }
      }
      await session.save();
    } else {
      //await session.save()
      return res;
    }
    return res;
  } catch (e) {
    Sentry.captureException(e);
    throw new Error("middleware err");
  }
}

//export async function middleware(req: NextRequest) {

//}

//export const config = {
//	matcher: [
//		/*
//		 * Match all request paths except for the ones starting with:
//		 * - _next (Next.js internal routes)
//		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
//		 * - public (public assets)
//		 */
//		'/((?!_next|favicon.ico|sitemap.xml|robots.txt|public).*)',
//	],
//}
