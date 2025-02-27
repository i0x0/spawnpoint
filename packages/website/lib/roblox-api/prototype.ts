import { RobloxApi } from './index';
export default abstract class Prototype {
	public root: RobloxApi

	constructor(x: RobloxApi) {
		this.root = x
	}
}