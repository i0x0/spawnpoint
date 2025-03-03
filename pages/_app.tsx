import '@/app/globals.css'
import type { AppProps } from 'next/app'
import { HyperText } from '@/components/magicui/hyper-text'
import AnimatedGrid from '@/components/AnimatedGrid'
import Link from 'next/link'


export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<div className="fixed bg-[#101010] h-svh w-screen overflow-hidden -z-[1]">
				{/*<AnimatedGrid gridSize={200} animationDuration={5} />*/}
				<AnimatedGrid />
			</div>
			<div
				className="h-svh w-screen overflow-hidden bg-repeat"
			>
				<div className="p-5 container overflow-hidden text-white">
					<div className="inline-flex justify-center items-center gap-4">
						<Link href="../">
							<HyperText animateOnHover={false} delay={0} className="text-4xl ">
								spawnpoint
							</HyperText>
						</Link>
					</div>
				</div>
				<div className="">
					<div className="flex text-white items-center justify-center ">
						<div className="bg-[#101010] p-10 rounded-lg backdrop-blur-sm w-full max-w-[50%] mx-auto">
							<article className="h-full flex items-center">
								<div className='prose prose-invert max-w-full'>
									<Component {...pageProps} />
								</div>
							</article>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}