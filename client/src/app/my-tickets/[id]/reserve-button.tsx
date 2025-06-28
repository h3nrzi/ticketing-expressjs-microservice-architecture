"use client";

import SubmitButton from "@/components/submit-button";
import { FormState } from "@/types/FormState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-hot-toast";
import { reserveTicket } from "@/lib/actions/orders-actions";
import ErrorDisplay from "@/components/error-display";

interface Props {
	ticketId: string;
}

const ReserveButton = ({ ticketId }: Props) => {
	const initialState: FormState = { errors: [], success: false };
	const [state, formAction] = useFormState(reserveTicket, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			toast.success("Ticket reserved successfully!");
			router.push("/my-tickets");
		}
	}, [state, router]);

	return (
		<div>
			<form action={formAction}>
				<ErrorDisplay errors={state?.errors} />
				<input type="hidden" name="ticketId" value={ticketId} />
				<SubmitButton className="btn btn-primary">Reserve Ticket</SubmitButton>
			</form>
		</div>
	);
};

export default ReserveButton;
