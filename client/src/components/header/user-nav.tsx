"use client";

import { signout } from "@/lib/actions/auth-actions";
import { FormState } from "@/types/FormState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import SubmitButton from "../submit-button";

interface UserNavProps {
	email: string;
}

export default function UserNav({ email }: UserNavProps) {
	const initialState: FormState = { errors: [], success: false };
	const [state, formAction] = useFormState(signout, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			router.refresh();
			toast.success("Logged out successfully! See you next time!");
		}
	}, [state, router]);

	return (
		<>
			<span className="nav-item nav-link">{email}</span>
			<form action={formAction} className="nav-item nav-link">
				<SubmitButton className="btn border btn-sm">Sign Out</SubmitButton>
			</form>
		</>
	);
}
