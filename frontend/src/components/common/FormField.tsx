import type { ErrorResponse } from "../../types/ErrorResponse";
import ErrorDisplay from "./ErrorDisplay";

interface Props {
	label: string;
	name: string;
	type: string;
	placeholder: string;
	errors?: ErrorResponse["errors"];
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
			value={props.value}
			onChange={props.onChange}
		/>
		<ErrorDisplay errors={props.errors} field={props.name} />
	</div>
);

export default FormField;
