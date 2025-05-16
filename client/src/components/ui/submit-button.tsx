"use client";

import React from "react";
import { useFormStatus } from "react-dom";

interface Props {
	children: React.ReactNode;
	className?: string;
}

export default function SubmitButton({ children, className }: Props) {
	const { pending } = useFormStatus();

	if (pending) {
		return (
			<button className={className} type="submit" disabled={pending}>
				<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
			</button>
		);
	}

	return (
		<button className={className} type="submit">
			{children}
		</button>
	);
}
