//"use client"
import Link from "next/link";
import AnimatedGrid from "@/components/AnimatedGrid";
import { cookies as c } from "next/headers";

import GlowingDotWithTooltip from "@/components/Dot";
import { formatDateWithTimezone, joinWithAnd, robloxStatusCheck } from "@/lib/utils";
import { HyperText } from "@/components/magicui/hyper-text";
import { cookies } from "@/lib/cookies";

export default async function Home() {
  // @ts-expect-error its fine tbh
  const session = await cookies(await c());
  //console.log(session)
  const status = await robloxStatusCheck()
  //console.log(status)

  return (
    <>
      <div className="fixed bg-[#101010] h-svh w-screen overflow-hidden -z-[1]">
        {/*<AnimatedGrid gridSize={200} animationDuration={5} />*/}
        <AnimatedGrid />
      </div>
      <div
        className=" h-svh w-screen overflow-hidden bg-repeat"
      >
        <div className="p-5 container overflow-hidden text-white">
          <div className="inline-flex justify-center items-center gap-4">
            <HyperText className="text-4xl">
              {/*<Image src={icon} width={40} height={40} />*/}
              spawnpoint
            </HyperText>
            <Link href="https://status.roblox.com/">
              {status === true ? (
                <GlowingDotWithTooltip
                  tooltipText="Roblox's systems seem to be ok"
                />
              ) : (
                <GlowingDotWithTooltip
                  variant="error"
                  tooltipText={`Currently ${joinWithAnd(status?.components as string[])} are experiencing issues since ${formatDateWithTimezone(new Date(status?.date as string))}`}
                />
              )}
            </Link>
          </div>
          <h2>
            a new way to manage your game's data
          </h2>
          <div className="absolute top-0 right-0 p-10">
            {session.keys ? (
              <Link href="/dashboard">
                <button className="outline-3 outline-offset-[9px] outline-[#242424] bg-[#101010] rounded-lg">Dashboard</button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="outline-3 outline-offset-[9px] outline-[#242424] bg-[#101010] bg-cover rounded-lg">Login with Roblox</button>
              </Link>
            )}
          </div>
          <div className="fixed bottom-10 left-0 right-0 hidden mx-auto w-fit sm:flex items-center">
            <Link href="https://i0x0.wtf">
              made by i0x0
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}