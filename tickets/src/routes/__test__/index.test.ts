import request from "supertest";
import app from "../../app";

function createTicket() {
	return request(app)
		.post("/api/tickets")
		.set("Cookie", global.signup())
		.send({ title: "asdf", price: 20 });
}

it("can fetch a list of ticks", async () => {
	await createTicket();
	await createTicket();
	await createTicket();

	const res = await request(app).get("/api/tickets").send({}).expect(200);
	expect(res.body.length).toEqual(3);
});
