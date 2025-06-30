"use client";

import React, { useEffect } from "react";
import ErrorDisplay from "@/components/error-display";
import { useFormState } from "react-dom";
import { signUp } from "../../../lib/actions/auth-actions";
import SubmitButton from "@/components/submit-button";
import { FormState } from "@/types/FormState";
import FormField from "@/components/form-field";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const initialState: FormState = { errors: [], success: false };
	const [state, formAction] = useFormState(signUp, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			toast.success("حساب کاربری با موفقیت ایجاد شد!");
			router.push("/");
		}
	}, [state, router]);

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<form className="card p-4 " action={formAction}>
						<h1 className="text-center mb-4">ثبت نام</h1>

						<FormField
							label="ایمیل"
							name="email"
							type="email"
							placeholder="ایمیل خود را وارد کنید"
							errors={state?.errors}
						/>

						<FormField
							label="رمز عبور"
							name="password"
							type="password"
							placeholder="رمز خود را وارد کنید"
							errors={state?.errors}
						/>

						<SubmitButton className="btn btn-primary w-100 mb-3">
							ثبت نام
						</SubmitButton>

						<Link href="/auth/signin" className="btn btn-secondary w-100 mb-3">
							حساب کاربری دارید؟
						</Link>

						{/* Display general errors */}
						<ErrorDisplay errors={state?.errors} />
					</form>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
