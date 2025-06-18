import Link from "next/link";

interface HomeContentProps {
	currentUser: { email: string } | null;
	errors?: { message: string }[];
}

export default function HomeContent({ currentUser, errors }: HomeContentProps) {
	if (errors) {
		return (
			<div className="container mt-5">
				<div className="alert alert-danger">
					Error: {errors.map((err) => err.message).join(", ")}
				</div>
			</div>
		);
	}

	return (
		<div className="container mt-5">
			{currentUser ? (
				<h1>Welcome {currentUser.email}!</h1>
			) : (
				<div>
					<h1>Welcome to Ticketing</h1>
					<p>Please sign in to continue.</p>
					<Link href="/auth/signin" className="btn btn-primary">
						Sign In
					</Link>
				</div>
			)}
		</div>
	);
}
