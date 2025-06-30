import SignoutButton from "./signout-button";

interface UserNavProps {
	email: string;
}

export default function UserNav({ email }: UserNavProps) {
	return (
		<div className="d-flex align-items-center">
			<span className="nav-item nav-link">{email}</span>
			<SignoutButton />
		</div>
	);
}
