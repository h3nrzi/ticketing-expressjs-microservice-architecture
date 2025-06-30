"use client";

import { useEffect, useState } from "react";

interface Props {
	timeToLeft: number;
}

const Timer = ({ timeToLeft }: Props) => {
	const initialTime = timeToLeft > 0 ? timeToLeft : 0;
	const [time, setTime] = useState(initialTime);

	useEffect(() => {
		const timerId = setInterval(() => {
			setTime((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(timerId);
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);

		return () => clearInterval(timerId);
	}, [timeToLeft]);

	return (
		<div>
			{Math.round(time) > 0 ? (
				<p className="h1 border p-1 rounded text-center">
					زمان باقی مانده برای پرداخت: {Math.round(time)} ثانیه
				</p>
			) : (
				<p className="h1 border p-1 rounded text-center text-danger">
					زمان پرداخت سفارش به پایان رسیده است
				</p>
			)}
		</div>
	);
};

export default Timer;
