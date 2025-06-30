"use client";

import ErrorDisplay from "@/components/error-display";
import SubmitButton from "@/components/submit-button";
import { reserveTicket } from "@/lib/actions/orders-actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-hot-toast";

interface Error {
	field?: string;
	message: string;
}

export interface FormState {
	errors: Error[];
	orderId: string | null;
	success: boolean;
}

interface Props {
	ticketId: string;
}

const ReserveButton = ({ ticketId }: Props) => {
	const initialState: FormState = {
		errors: [],
		success: false,
		orderId: null,
	};
	const [state, formAction] = useFormState(reserveTicket, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			toast.success("تیکت با موفقیت رزرو شد!");
			router.push("/orders/" + state.orderId);
		}
	}, [state, router]);

	return (
		<div>
			<form action={formAction}>
				<ErrorDisplay errors={state?.errors} />
				<input type="hidden" name="ticketId" value={ticketId} />
				<SubmitButton className="btn btn-primary">رزرو تیکت</SubmitButton>
			</form>
		</div>
	);
};

export default ReserveButton;
