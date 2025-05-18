import Link from "next/link";
import UserNav from "./UserNav";
import AuthLinks from "../auth/AuthLinks";
import { getCurrentUser } from "@/lib/api/users-api";

export default async function Header() {
	const { data } = await getCurrentUser();

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container">
				<Link href="/" className="navbar-brand">
					Ticketing
				</Link>
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
