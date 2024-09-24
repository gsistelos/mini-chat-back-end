import { eq } from "drizzle-orm";
import db from "../db/db.js";
import { followsTable } from "../db/schema.js";
import type { FollowInput } from "../types/FollowInput.js";
// import { validateFollowExists } from "../validators/followsValidator.js";
import { validateUserId } from "../validators/usersValidator.js";

const selectFields = {
	id: followsTable.id,
	followerId: followsTable.followerId,
	followedId: followsTable.followedId,
	createdAt: followsTable.createdAt,
};

export async function createFollow(follow: FollowInput) {
	const { followerId, followedId } = follow;

	await validateUserId(followerId, "followerId");
	await validateUserId(followedId, "followedId");

	// await validateFollowExists(followerId, followedId);

	const [ret] = await db
		.insert(followsTable)
		.values(follow)
		.returning(selectFields);

	return ret;
}

export async function getFollowById(id: string) {
	const [ret] = await db
		.select(selectFields)
		.from(followsTable)
		.where(eq(followsTable.id, id))
		.limit(1);

	return ret;
}