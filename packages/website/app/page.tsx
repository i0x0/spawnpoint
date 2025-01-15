"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const content = [
    "bg1.png",
    "bg2.png",
    "bg3.png",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === content.length - 1 ? 0 : prevIndex + 1
      );
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="fixed bg-[#101010] h-svh w-screen overflow-hidden bg-repeat"
      style={{
        backgroundImage: `url(${content[currentIndex]})`
      }}
    >
      <div className="p-5 container overflow-hidden text-white">
        <div>
          <h1 className="text-4xl inline-flex justify-between items-baseline gap-4">
            {/*<Image src={icon} width={40} height={40} />*/}
            spawnpoint
          </h1>
          <h2>
            a new way to manage your game's data
          </h2>
        </div>
        <div className="absolute top-0 right-0 p-10">
          <Link href="/login">
            <button className="outline outline-offset-[9px] outline-[#242424] bg-[#101010] rounded-lg">Login with Roblox</button></Link>
        </div>
      </div>
    </div>
  );
}
