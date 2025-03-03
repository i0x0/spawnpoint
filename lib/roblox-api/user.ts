import Prototype from "./prototype";
import safeAwait from 'safe-await';
import { RobloxUserInfo } from "./types";

export default class User extends Prototype {
	public async self() {
		const [error, userInfo] = await safeAwait(
			this.root.request<RobloxUserInfo>("GET", "oauth/v1/userinfo", {})
		);

		if (error) {
			throw new Error('Failed to fetch user info: ' + error.message);
		}

		// Validate required OIDC claims
		if (!userInfo.sub) {
			throw new Error('Missing required sub claim in userinfo response');
		}

		return userInfo;
	}
}