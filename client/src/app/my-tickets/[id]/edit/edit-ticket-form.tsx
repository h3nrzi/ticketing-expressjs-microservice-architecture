"use client";

import { FormState } from "@/types/FormState";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import FormField from "@/components/form-field";
import SubmitButton from "@/components/submit-button";
import ErrorDisplay from "@/components/error-display";
import { updateTicket } from "@/lib/actions/tickets-actions";
import { Ticket } from "@/types/Ticket";

interface Props {
	ticket: Ticket;
}

const EditTicketForm = ({ ticket }: Props) => {
	const initialState: FormState = { errors: [], success: false };
	const [state, formAction] = useFormState(updateTicket, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			toast.success("تیکت با موفقیت ویرایش شد!");
			router.push("/my-tickets");
		}
	}, [state, router]);

	return (
		<div className="container mt-5">
			<div className="row">
				<div className="col-md-6">
					<form action={formAction}>
						<h1 className="mb-4">ویرایش تیکت</h1>

						<input type="hidden" name="id" value={ticket.id} />

						<FormField
							label="نام تیکت"
							name="title"
							type="text"
							placeholder="نام تیکت خود را وارد کنید"
							errors={state?.errors}
							defaultValue={ticket.title}
						/>

						<FormField
							label="قیمت تیکت"
							name="price"
							type="number"
							placeholder="قیمت تیکت خود را وارد کنید"
							errors={state?.errors}
							defaultValue={ticket.price}
						/>

						<SubmitButton className="btn btn-primary w-100 mb-3">
							ویرایش تیکت
						</SubmitButton>

						{/* Display general errors */}
						<ErrorDisplay errors={state?.errors} />
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditTicketForm;
