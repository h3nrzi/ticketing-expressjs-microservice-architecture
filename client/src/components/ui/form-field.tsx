import React from "react";
import ErrorDisplay from "@/components/ui/error-display";
import { ErrorResponse } from "@/types/ErrorResponse";

interface Props {
	label: string;
	name: string;
	type: string;
	placeholder: string;
	errors?: ErrorResponse["errors"];
}

const FormField = ({ label, name, type, placeholder, errors }: Props) => (
	<div className="form-group mb-3">
		<label className="form-label" htmlFor={name}>
			{label}
		</label>
		<input className="form-control" type={type} name={name} id={name} placeholder={placeholder} />
		<ErrorDisplay errors={errors} field={name} />
	</div>
);

export default FormField;
