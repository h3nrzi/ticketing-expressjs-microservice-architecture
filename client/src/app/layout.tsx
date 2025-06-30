import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-rtl/dist/css/bootstrap-rtl.min.css";
import "@/styles/custom-bootstrap.css";
import { ClientToaster } from "./client-toaster";
import Header from "@/components/header/header";

// app/fonts.js
import localFont from "next/font/local";

export const VazirMedium = localFont({
	src: "../public/fonts/Vazir-Medium.ttf",
	variable: "--font-vazir-medium",
});

export const VazirBold = localFont({
	src: "../public/fonts/Vazir-Bold.ttf",
	variable: "--font-vazir-bold",
});

export const Vazir = localFont({
	src: [
		{
			path: "../public/fonts/Vazir-Thin.ttf",
			weight: "100",
			style: "normal",
		},
		{
			path: "../public/fonts/Vazir-Light.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "../public/fonts/Vazir-Medium.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/Vazir-Bold.ttf",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-vazir",
});

export const metadata: Metadata = {
	title: "بلیط کنسرت",
	description: "بلیط کنسرت",
};

export default async function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="fa" dir="rtl">
			<body style={{ fontFamily: "Vazir" }}>
				<Header />
				{children}
				<ClientToaster />
			</body>
		</html>
	);
}
