import React from "react";
import ErrorDisplay from "@/components/error-display";
import { ErrorResponse } from "@/types/ErrorResponse";

interface Props {
	label: string;
	name: string;
	type: string;
	placeholder: string;
	errors?: ErrorResponse["errors"];
	defaultValue?: string | number;
}

const FormField = (props: Props) => (
	<div className="form-group mb-3">
		<label className="form-label" htmlFor={props.name}>
			{props.label}
		</label>
		<input
			className="form-control"
			type={props.type}
			name={props.name}
			id={props.name}
			placeholder={props.placeholder}
			defaultValue={props.defaultValue}
		/>
		<ErrorDisplay errors={props.errors} field={props.name} />
	</div>
);

export default FormField;
