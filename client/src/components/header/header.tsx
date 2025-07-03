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

				{/* user nav or auth links */}
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
