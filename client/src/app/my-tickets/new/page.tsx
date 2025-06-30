"use client";

import React, { useEffect } from "react";
import ErrorDisplay from "@/components/error-display";
import { useFormState } from "react-dom";
import { createTicket } from "@/lib/actions/tickets-actions";
import SubmitButton from "@/components/submit-button";
import { FormState } from "@/types/FormState";
import FormField from "@/components/form-field";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const NewTicketPage = () => {
	const initialState: FormState = { errors: [], success: false };
	const [state, formAction] = useFormState(createTicket, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			toast.success("تیکت با موفقیت ایجاد شد!");
			router.push("/my-tickets");
		}
	}, [state, router]);

	return (
		<div className="container mt-5">
			<div className="row">
				<div className="col-md-6">
					<form action={formAction}>
						<h1 className="mb-4">ساخت تیکت جدید</h1>

						<FormField
							label="نام تیکت"
							name="title"
							type="text"
							placeholder="نام تیکت خود را وارد کنید"
							errors={state?.errors}
						/>

						<FormField
							label="قیمت تیکت"
							name="price"
							type="number"
							placeholder="قیمت تیکت خود را وارد کنید"
							errors={state?.errors}
						/>

						<SubmitButton className="btn btn-primary w-100 mb-3">
							ایجاد تیکت
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
