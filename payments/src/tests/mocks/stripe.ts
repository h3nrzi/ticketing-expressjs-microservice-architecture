const mockCharges: any[] = [];

export const stripe = {
	charges: {
		create: jest.fn().mockImplementation((params: any) => {
			const charge = { id: "mock_charge_id", amount: params.amount };
			mockCharges.push(charge);
			return Promise.resolve(charge);
		}),
		list: jest.fn().mockImplementation(() => {
			return Promise.resolve({ data: mockCharges });
		})
	}
};
