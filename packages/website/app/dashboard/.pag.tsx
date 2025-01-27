import { authRequired } from "@/api";
import AnimatedGrid from '../../components/AnimatedGrid';
import safeAwait from "safe-await";
//import Image from "next/image";

export const dynamic = 'force-dynamic'

export default async function Profile() {
	const api = await authRequired()
	const [err, user] = await safeAwait(api.user.self())
	const [err2, resources] = await safeAwait(api.auth.resources())
	//console.log(api)	
	//console.log(api.clientId)

	return (
		<>
			<div className="fixed bg-[#101010] h-svh w-screen overflow-hidden -z-[1]">
				{/*<AnimatedGrid gridSize={200} animationDuration={5} />*/}
				<AnimatedGrid />
			</div>
			<div className="w-screen overflow-hidden bg-repeat">
				<div className="p-5 container text-white">
					{/* User Welcome Section */}
					<div className="flex items-center gap-4 mb-8">
						<h1 className="text-4xl">Welcome {user?.name}</h1>
						{user?.picture && (
							<img
								src={user.picture}
								width={50}
								height={50}
								className="bg-[#d4d4d4] rounded-full"
								alt="Profile picture"
							/>
						)}
					</div>

					{/* Resources Dashboard */}
					<div className="bg-[#202020] rounded-lg p-6">
						<h2 className="text-2xl mb-4">Resources Dashboard</h2>

						{resources?.resource_infos && resources.resource_infos.length > 0 ? (
							<div className="space-y-4">
								<select
									className="bg-[#303030] text-white p-2 rounded-md w-64"
									defaultValue=""
								>
									<option value="" disabled>Select an owner</option>
									{resources.resource_infos.map((info, index) => (
										<option
											key={index}
											value={`${info.owner.type}-${info.owner.id}`}
										>
											{info.owner.type}: {info.owner.id}
										</option>
									))}
								</select>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{resources.resource_infos.map((info, index) => (
										<div
											key={index}
											className="bg-[#303030] p-4 rounded-lg"
										>
											<h3 className="text-xl mb-2">
												{info.owner.type}: {info.owner.id}
											</h3>
											<div className="space-y-2">
												<h4 className="text-gray-400">Universe IDs:</h4>
												{info.resources.universe.ids.map((id, idx) => (
													<div
														key={idx}
														className="bg-[#404040] p-2 rounded"
													>
														{id}
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						) : (
							<p>No resources available</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
}