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
					خطا: {errors.map((err) => err.message).join(", ")}
				</div>
			</div>
		);
	}

	return (
		<div className="container mt-5">
			{currentUser ? (
				<h1>خوش آمدید {currentUser.email}!</h1>
			) : (
				<div>
					<h1>به سایت خرید آنلاین بلیط کنسرت خوش آمدید</h1>
					<p>لطفا برای ادامه وارد حساب کاربری خود شوید.</p>
					<Link href="/auth/signin" className="btn btn-primary">
						ورود
					</Link>
				</div>
			)}
		</div>
	);
}
