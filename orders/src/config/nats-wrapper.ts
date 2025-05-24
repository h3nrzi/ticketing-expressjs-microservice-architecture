import stan, { Stan } from "node-nats-streaming";

class NatsWrapper {
	private _client?: Stan;

	get client(): Stan {
		if (!this._client)
			throw new Error("Cannot access NATS client before connecting");
		return this._client;
	}

	connect(clusterId: string, clientId: string, url: string): Promise<void> {
		// connect to the NATS server
		this._client = stan.connect(clusterId, clientId, {
			url,
		});

		return new Promise<void>((resolve, reject) => {
			// handle the connect event
			this.client.on("connect", () => {
				console.log("Connected to NATS");
				resolve();
			});

			// handle the error event
			this.client.on("error", (err) => {
				reject(err);
			});
		});
	}
}

export const natsWrapper = new NatsWrapper();
