import Queue from "bull";

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
	console.log(
		"I want to publish an expiration:complete event for orderId: ",
		job.data.orderId
	);
});

export default expirationQueue;
