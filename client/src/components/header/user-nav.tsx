import Link from "next/link";
import SignoutButton from "./signout-button";

interface UserNavProps {
	email: string;
}

export default function UserNav({ email }: UserNavProps) {
	return (
		<div className="btn-group">
			<button
				type="button"
				className="btn btn-primary dropdown-toggle"
				data-toggle="dropdown"
				aria-haspopup="true"
				aria-expanded="false"
			>
				{email}
			</button>
			<div className="dropdown-menu">
				<Link className="dropdown-item" href="/my-tickets">
					تیکت های من
				</Link>
				<Link className="dropdown-item" href="/orders">
					سفارش های من
				</Link>
				<div className="dropdown-divider"></div>
				<SignoutButton />
			</div>
		</div>
	);
}
