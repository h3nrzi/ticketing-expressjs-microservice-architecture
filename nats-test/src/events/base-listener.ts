import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

/** Base interface for all events in the system */
export interface Event {
	/** The subject of the event */
	subject: Subjects;

	/** The data payload of the event */
	data: any;
}

/**
 * Base class for all event listeners
 * @template T - The type of event this listener handles
 */
export abstract class BaseListener<T extends Event> {
	/**
	 * The subject this listener is subscribed to
	 * Used to specify the type of event this listener handles
	 */
	abstract readonly subject: T["subject"];

	/**
	 * The queue group name for this listener
	 * Used to ensure messages are only processed once per queue group
	 */
	abstract readonly queueGroupName: string;

	/**
	 * The time to wait for an acknowledgment before retrying
	 * Used to specify the time to wait for an acknowledgment before retrying
	 */
	protected readonly ackWait = 5 * 1000;

	/**
	 * Constructor for the BaseListener
	 * @param client - The NATS streaming client
	 */
	constructor(protected readonly client: Stan) {}

	/**
	 * Sets up the subscription options for NATS
	 * Used to configure the subscription options for NATS
	 */
	protected subscriptionOptions() {
		return this.client
			.subscriptionOptions()
			.setDeliverAllAvailable()
			.setManualAckMode(true)
			.setAckWait(this.ackWait)
			.setDurableName(this.queueGroupName);
	}

	/**
	 * Parses the message data from NATS
	 * Used to parse the message data from NATS
	 * @param msg - The message from NATS
	 * @returns The parsed data
	 */
	protected parseMessage(msg: Message): T["data"] {
		const data = msg.getData();
		return typeof data === "string"
			? JSON.parse(data)
			: JSON.parse(data.toString("utf8"));
	}

	/**
	 * Starts listening for messages on the subject
	 * Used to start listening for messages on the subject
	 */
	listen(): void {
		const subscription = this.client.subscribe(
			this.subject,
			this.queueGroupName,
			this.subscriptionOptions()
		);

		subscription.on("message", (msg: Message) => {
			console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
			const parsedData = this.parseMessage(msg);
			this.onMessage(parsedData, msg);
		});
	}

	/**
	 * Handles the received message
	 * Used to handle the received message
	 * @param data - The parsed message data
	 * @param msg - The original message from NATS
	 */
	abstract onMessage(data: T["data"], msg: Message): void;
}
