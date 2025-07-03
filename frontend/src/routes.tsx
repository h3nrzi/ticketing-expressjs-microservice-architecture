import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import App from "./App";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <AppLayout />,
		children: [
			{ index: true, element: <App /> },
			{ path: "/login", element: <SignInPage /> },
			{ path: "/register", element: <SignUpPage /> },
		],
	},
]);
