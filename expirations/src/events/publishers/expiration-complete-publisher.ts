import {
	Subjects,
	BasePublisher,
	ExpirationCompleteEvent,
} from "@h3nrzi-ticket/common";

export class ExpirationCompletePublisher extends BasePublisher<ExpirationCompleteEvent> {
	readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
	readonly queueGroupName = "expiration-service";
}
