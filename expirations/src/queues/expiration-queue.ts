import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../config/nats-wrapper";

interface Payload {
	orderId: string;
}

// ===============================
// Queue Definition
// ===============================

const expirationQueue = new Queue<Payload>("order:expiration", {
	redis: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT!),
	},
});

// ===============================
// Queue Processor
// ===============================

expirationQueue.process(async (job) => {
	new ExpirationCompletePublisher(natsWrapper.client).publish({
		orderId: job.data.orderId,
	});
});

export default expirationQueue;
