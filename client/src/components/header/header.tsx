import Link from "next/link";
import UserNav from "./user-nav";
import AuthLinks from "./auth-links";
import { getCurrentUser } from "@/lib/api/users-api";

export default async function Header() {
	const { data } = await getCurrentUser();

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container">
				{/* logo */}
				<Link href="/" className="navbar-brand">
					<span className="h1">🎟️</span>
				</Link>

				{/* if the user is logged in, show the my tickets link */}
				{data?.currentUser && (
					<Link href="/my-tickets" className="navbar-text">
						My Tickets
					</Link>
				)}

				{/* if the user is logged in, show the orders link */}
				{data?.currentUser && (
					<Link href="/orders" className="navbar-text">
						My Orders
					</Link>
				)}

				{/* if the user is logged in, show the user nav, otherwise show the auth links */}
				<div className="navbar-nav ms-auto">
					{data?.currentUser ? (
						<UserNav email={data.currentUser.email} />
					) : (
						<AuthLinks />
					)}
				</div>
			</div>
		</nav>
	);
}
