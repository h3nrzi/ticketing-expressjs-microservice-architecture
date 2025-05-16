"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserNavProps {
	email: string;
}

export default function UserNav({ email }: UserNavProps) {
	const router = useRouter();

	const handleSignOut = async () => {
		try {
			await axios.post("/api/users/signout", {}, { withCredentials: true });
			router.refresh();
			toast.success("Logged out successfully! See you next time!");
		} catch (error) {
			console.error((error as AxiosError).response?.data);
		}
	};

	return (
		<>
			<span className="nav-item nav-link">{email}</span>
			<button onClick={handleSignOut} className="nav-item nav-link btn border btn-sm">
				Sign Out
			</button>
		</>
	);
}
