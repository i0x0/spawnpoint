"use client";

import { Action } from "@/lib/roblox-api/types";
import ky from "ky";
import { useState } from "react";
import { toast } from "react-toastify";
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

const Actions = ({ uni }: { uni: string }) => {
	let [isOpen, setIsOpen] = useState(false)
	const restart = async () => {
		toast.promise(
			ky.post('/api/action', {
				json: {
					action: Action.RESTART_UNIVERSE,
					universeId: uni
				},
				cache: "no-store"
			}), {
			pending: "telling roblox to restart",
			success: "restarted universe",
			error: "something wrong happened"
		}
		)
	}

	const publish = async (d: FormData) => {
		setIsOpen(false)
		toast.promise(
			ky.post('/api/action', {
				json: {
					action: Action.PUBLISH_UNIVERSE,
					universeId: uni,
					data: {
						topic: d.get("topic"),
						message: d.get("message")
					}
				},
				cache: "no-store"
			}), {
			pending: "telling roblox to publish",
			success: "published",
			error: "something wrong happened"
		}
		)
	}


	return (
		<>
			<li className="p-2.5">
				<button className="text-white hover:text-gray-300 cursor-pointer" onClick={restart}>Restart Universe</button>
			</li>
			<li className="p-2.5">
				<button className="text-white hover:text-gray-300 cursor-pointer" onClick={() => setIsOpen(true)}>Publish Message</button>
				<Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
					<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex w-screen items-center justify-center p-4">
						<DialogPanel className="w-full max-w-lg space-y-6 rounded-xl border border-[#262626] bg-[#111111] p-8 shadow-2xl">
							<DialogTitle className="text-2xl font-bold text-white">Publish Universe</DialogTitle>
							<Description className="text-gray-400">
								Publish changes to this universe with a topic and message
							</Description>

							<form className="space-y-4" action={publish}>
								<div>
									<label htmlFor="topic" className="block text-sm font-medium text-gray-300">
										Topic
									</label>
									<input
										type="text"
										id="topic"
										name="topic"
										required
										className="mt-1 block w-full rounded-md border border-[#262626] bg-[#222222] px-3 py-2 text-white shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
										placeholder="Enter publish topic"
									/>
								</div>

								<div>
									<label htmlFor="message" className="block text-sm font-medium text-gray-300">
										Message
									</label>
									<textarea
										id="message"
										name="message"
										required
										rows={4}
										className="mt-1 block w-full rounded-md border border-[#262626] bg-[#222222] px-3 py-2 text-white shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
										placeholder="Enter publish message"
									/>
								</div>

								<div className="flex justify-end gap-4 pt-4">
									<button
										type="button"
										onClick={() => setIsOpen(false)}
										className="rounded-md bg-[#222222] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#262626]"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#111111]"
									>
										Publish
									</button>
								</div>
							</form>
						</DialogPanel>
					</div>
				</Dialog>
			</li>
			{/*<li className="py-1">
				<button className="text-red-400 hover:text-red-500 cursor-pointer">Delete Universe</button>
			</li>*/}
		</>
	)
}

export default Actions