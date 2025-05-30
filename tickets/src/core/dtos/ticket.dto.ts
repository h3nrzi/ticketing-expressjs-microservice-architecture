export interface CreateTicketDto {
	title: string;
	price: number;
}

export interface UpdateTicketDto extends Partial<CreateTicketDto> {}
