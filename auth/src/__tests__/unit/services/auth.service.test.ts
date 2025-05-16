import { AuthService } from "../../../services/auth.service";
import { UserRepository } from "../../../repositories/user.repository";
import { BadRequestError } from "@h3nrzi-ticket/common";
import { VALID_USER } from "../../helpers/test-utils";

describe("AuthService", () => {
	let authService: AuthService;
	let userRepository: UserRepository;

	beforeEach(() => {
		userRepository = new UserRepository();
		authService = new AuthService(userRepository);
	});

	describe("signup", () => {
		it("should create a new user successfully", async () => {
			const result = await authService.signup(
				VALID_USER.email,
				VALID_USER.password
			);

			expect(result.user).toBeDefined();
			expect(result.user.email).toBe(VALID_USER.email);
			expect(result.token).toBeDefined();
		});

		it("should throw BadRequestError if email is already in use", async () => {
			await authService.signup(VALID_USER.email, VALID_USER.password);

			await expect(
				authService.signup(VALID_USER.email, VALID_USER.password)
			).rejects.toThrow(BadRequestError);
		});
	});

	describe("signin", () => {
		it("should sign in user with valid credentials", async () => {
			await authService.signup(VALID_USER.email, VALID_USER.password);
			const result = await authService.signin(
				VALID_USER.email,
				VALID_USER.password
			);

			expect(result.user).toBeDefined();
			expect(result.user.email).toBe(VALID_USER.email);
			expect(result.token).toBeDefined();
		});

		it("should throw BadRequestError with invalid email", async () => {
			await expect(
				authService.signin("nonexistent@test.com", VALID_USER.password)
			).rejects.toThrow(BadRequestError);
		});

		it("should throw BadRequestError with invalid password", async () => {
			await authService.signup(VALID_USER.email, VALID_USER.password);

			await expect(
				authService.signin(VALID_USER.email, "wrongpassword")
			).rejects.toThrow(BadRequestError);
		});
	});

	describe("getCurrentUser", () => {
		it("should return user if exists", async () => {
			const { user } = await authService.signup(
				VALID_USER.email,
				VALID_USER.password
			);
			const result = await authService.getCurrentUser(user.id);

			expect(result).toBeDefined();
			expect(result?.email).toBe(VALID_USER.email);
		});

		it("should return null if user does not exist", async () => {
			const result = await authService.getCurrentUser("nonexistentid");
			expect(result).toBeNull();
		});
	});
});
