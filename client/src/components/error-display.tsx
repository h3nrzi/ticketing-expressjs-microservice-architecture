import { ErrorResponse } from "@/types/ErrorResponse";

interface ErrorDisplayProps {
	field?: string;
	errors?: ErrorResponse["errors"];
}

export default function ErrorDisplay({ errors, field }: ErrorDisplayProps) {
	// If there are no errors, return null
	if (!errors) return null;

	// If field is provided, show only field-specific errors
	// If field is not provided, show only general errors (errors without field)
	const displayErrors = field
		? errors.filter((error) => error.field === field)
		: errors.filter((error) => !error.field);

	// If there are no errors to display, return null
	if (displayErrors.length === 0) return null;

	// Display the errors
	return (
		<div className="mt-2">
			{displayErrors.map((error) => (
				<div key={error.message} className="alert alert-danger">
					{error.message}
				</div>
			))}
		</div>
	);
}
