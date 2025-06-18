"use client";

import React, { useEffect } from "react";
import ErrorDisplay from "@/components/ui/error-display";
import { useFormState } from "react-dom";
import { createTicket } from "@/lib/actions/tickets-actions";
import SubmitButton from "@/components/ui/submit-button";
import { FormState } from "@/types/FormState";
import FormField from "@/components/ui/form-field";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const NewTicketPage = () => {
	const initialState: FormState = { errors: [], success: false };
	const [state, formAction] = useFormState(createTicket, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			toast.success("Ticket created successfully!");
			// router.push("/tickets");
		}
	}, [state, router]);

	return (
		<div className="container mt-5">
			<div className="row">
				<div className="col-md-6">
					<form action={formAction}>
						<h1 className="mb-4">Create a Ticket</h1>

						<FormField
							label="Title"
							name="title"
							type="text"
							placeholder="Enter the title of the ticket"
							errors={state?.errors}
						/>

						<FormField
							label="Price"
							name="price"
							type="number"
							placeholder="Enter the price of the ticket"
							errors={state?.errors}
						/>

						<SubmitButton className="btn btn-primary w-100 mb-3">
							Create Ticket
						</SubmitButton>

						{/* Display general errors */}
						<ErrorDisplay errors={state?.errors} />
					</form>
				</div>
			</div>
		</div>
	);
};

export default NewTicketPage;
