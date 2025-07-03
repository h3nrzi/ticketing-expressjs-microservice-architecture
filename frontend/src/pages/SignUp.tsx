import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import ErrorDisplay from "../components/common/ErrorDisplay";
import FormField from "../components/common/FormField";
import type { ErrorResponse } from "../types/ErrorResponse";

export default function SignUpPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<ErrorResponse["errors"]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setIsLoading(true);

			const response = await fetch("/api/auth/signup", {
				method: "POST",
				body: JSON.stringify({ email, password }),
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});

			setIsLoading(false);

			if (response.ok) {
				toast.success("ثبت نام با موفقیت انجام شد!");
				navigate("/");
			} else {
				const errorData = await response.json();
				setErrors(errorData.errors || []);
			}
		} catch (error: unknown) {
			console.error(error);
			setIsLoading(false);
		}
	};

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<form className="card p-4" onSubmit={handleSubmit}>
						<h1 className="text-center mb-4">ثبت نام</h1>

						<FormField
							label="ایمیل"
							name="email"
							type="email"
							placeholder="ایمیل خود را وارد کنید"
							errors={errors}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<FormField
							label="رمز عبور"
							name="password"
							type="password"
							placeholder="رمز خود را وارد کنید"
							errors={errors}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<button
							type="submit"
							className="btn btn-primary w-100 mb-3"
							disabled={isLoading}
						>
							{isLoading ? "در حال بارگذاری..." : "ثبت نام"}
						</button>

						<Link to="/login" className="w-100 mb-3">
							حساب کاربری دارید؟
						</Link>

						<ErrorDisplay errors={errors} />
					</form>
				</div>
			</div>
		</div>
	);
}
