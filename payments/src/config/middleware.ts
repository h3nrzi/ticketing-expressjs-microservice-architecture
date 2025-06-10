import { Express } from "express";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import { currentUser } from "@h3nrzi-ticket/common";

export function configureMiddleware(app: Express) {
	// Trust proxy is used for ingress nginx
	app.set("trust proxy", true);

	// Body parser is used to parse the request body
	app.use(bodyParser.json());

	// Cookie session is used to authenticate the user
	app.use(
		cookieSession({
			signed: false,
			secure: false,
			httpOnly: true,
		})
	);

	// Current user is used to get the current user from the cookie session
	app.use(currentUser);
}
