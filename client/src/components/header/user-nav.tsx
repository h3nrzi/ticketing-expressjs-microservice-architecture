import SignoutButton from "./signout-button";

interface UserNavProps {
	email: string;
}

export default function UserNav({ email }: UserNavProps) {
	return (
		<>
			<span className="nav-item nav-link">{email}</span>
			<SignoutButton />
		</>
	);
}
