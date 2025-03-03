import Prototype from "./prototype";

export default class DataStore extends Prototype {
	public async list(id: string) {
		return await this.root.instance.extend({
			headers: {
				//'Authorization': undefined
			}
		}).get(`datastores/v1/universes/${id}/standard-datastores`, {
			searchParams: {
				maxPageSize: 70
			},
			headers: {
				//'x-api-key': this.root.tokens.access_token,
				//'Authorization': undefined
			}
		})

	}
}