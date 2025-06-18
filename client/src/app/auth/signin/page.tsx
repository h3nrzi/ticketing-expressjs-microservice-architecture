"use client";

import React, { useEffect } from "react";
import ErrorDisplay from "@/components/error-display";
import { useFormState } from "react-dom";
import { signin } from "../../../lib/actions/auth-actions";
import SubmitButton from "@/components/submit-button";
import { FormState } from "@/types/FormState";
import FormField from "@/components/form-field";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignInPage = () => {
	const initialState: FormState = { errors: [], success: false };
	const [state, formAction] = useFormState(signin, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			toast.success("Logged in successfully!");
			router.push("/");
		}
	}, [state, router]);

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<form className="card p-4" action={formAction}>
						<h1 className="text-center mb-4">Login</h1>

						<FormField
							label="Email"
							name="email"
							type="email"
							placeholder="Enter your email"
							errors={state?.errors}
						/>

						<FormField
							label="Password"
							name="password"
							type="password"
							placeholder="Enter your password"
							errors={state?.errors}
						/>

						<SubmitButton className="btn btn-primary w-100 mb-3">
							Login
						</SubmitButton>

						<Link href="/auth/signup" className="btn btn-secondary w-100 mb-3">
							Don&apos;t have an account? Sign Up
						</Link>

						{/* Display general errors */}
						<ErrorDisplay errors={state?.errors} />
					</form>
				</div>
			</div>
		</div>
	);
};

export default SignInPage;
