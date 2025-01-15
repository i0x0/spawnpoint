import { cookies as c } from "next/headers";

import { cookies } from "@/api";

export default async function Profile() {
	const session = await cookies(await c());

	return <div>{JSON.stringify(session)}</div>;
}