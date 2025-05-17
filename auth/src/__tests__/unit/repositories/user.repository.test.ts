import { UserRepository } from "../../../users/user.repository";
import { VALID_USER } from "../../helpers/test-utils";
import { setupTestDB } from "../../helpers/test-utils";
import mongoose from "mongoose";

describe("UserRepository", () => {
	setupTestDB();
	let userRepository: UserRepository;

	beforeEach(() => {
		userRepository = new UserRepository();
	});

	describe("findByEmail", () => {
		it("should find user by email", async () => {
			const user = await userRepository.create(VALID_USER);
			const foundUser = await userRepository.findByEmail(VALID_USER.email);

			expect(foundUser).toBeDefined();
			expect(foundUser?.email).toBe(VALID_USER.email);
		});

		it("should return null when user not found", async () => {
			const foundUser = await userRepository.findByEmail("nonexistent@test.com");
			expect(foundUser).toBeNull();
		});
	});

	describe("create", () => {
		it("should create a new user", async () => {
			const user = await userRepository.create(VALID_USER);

			expect(user).toBeDefined();
			expect(user.email).toBe(VALID_USER.email);
			expect(user.id).toBeDefined();
		});
	});

	describe("findById", () => {
		it("should find user by id", async () => {
			const createdUser = await userRepository.create(VALID_USER);
			const foundUser = await userRepository.findById(createdUser.id);

			expect(foundUser).toBeDefined();
			expect(foundUser?.id).toBe(createdUser.id);
			expect(foundUser?.email).toBe(VALID_USER.email);
		});

		it("should return null when user not found", async () => {
			const nonExistentId = new mongoose.Types.ObjectId().toHexString();
			const foundUser = await userRepository.findById(nonExistentId);
			expect(foundUser).toBeNull();
		});
	});
});
