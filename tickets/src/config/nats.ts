import stan, { Stan } from "node-nats-streaming";

class NatsWrapper {
	/**
	 * @description The client of the NATS wrapper
	 * @private
	 * @type {Stan | undefined}
	 */
	private _client?: Stan;

	/**
	 * @description Get the client of the NATS wrapper
	 * @getter
	 * @returns {Stan} - The client of the NATS wrapper
	 */
	get client(): Stan {
		if (!this._client)
			throw new Error("Cannot access NATS client before connecting");
		return this._client;
	}

	/**
	 * @description Set the client of the NATS wrapper
	 * @setter
	 * @param {Stan} client - The client of the NATS wrapper
	 */
	set client(client: Stan) {
		throw new Error("Cannot set client");
	}

	/**
	 * @description Connect to the NATS server
	 * @param {string} clusterId - The cluster ID
	 * @param {string} clientId - The client ID
	 * @param {string} url - The URL of the NATS server
	 * @returns {Promise<void>} - A promise that resolves to void
	 */
	connect(clusterId: string, clientId: string, url: string): Promise<void> {
		this._client = stan.connect(clusterId, clientId, {
			url,
		});

		return new Promise<void>((resolve, reject) => {
			this.client.on("connect", () => {
				console.log("Connected to NATS");
				resolve();
			});

			this.client.on("error", (err) => {
				reject(err);
			});
		});
	}
}

export const natsWrapper = new NatsWrapper();
