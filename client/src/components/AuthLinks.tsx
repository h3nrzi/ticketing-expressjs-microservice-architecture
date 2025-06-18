"use client";

import Link from "next/link";

export default function AuthLinks() {
	return (
		<>
			<Link href="/auth/signin" className="nav-item nav-link">
				Sign In
			</Link>
			<Link href="/auth/signup" className="nav-item nav-link">
				Sign Up
			</Link>
		</>
	);
}
