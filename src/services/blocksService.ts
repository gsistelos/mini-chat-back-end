import { and, eq } from "drizzle-orm";
import db from "../db/db.js";
import { blocksTable } from "../db/schema.js";
import NotFoundError from "../errors/NotFoundError.js";
import type { BlockInput } from "../types/BlockInput.js";
import { validateBlockExists } from "../validators/blocksValidator.js";

const selectFields = {
	id: blocksTable.id,
	blockerId: blocksTable.blockerId,
	blockedId: blocksTable.blockedId,
	createdAt: blocksTable.createdAt,
};

export async function createBlock(block: BlockInput) {
	validateBlockExists(block.blockerId, block.blockedId);

	const [ret] = await db
		.insert(blocksTable)
		.values(block)
		.returning(selectFields);

	return ret;
}

export async function getBlockById(id: string) {
	const [ret] = await db
		.select(selectFields)
		.from(blocksTable)
		.where(eq(blocksTable.id, id))
		.limit(1);

	return ret;
}

export async function getBlockByUsersId(blockerId: string, blockedId: string) {
	const [ret] = await db
		.select(selectFields)
		.from(blocksTable)
		.where(
			and(
				eq(blocksTable.blockerId, blockerId),
				eq(blocksTable.blockedId, blockedId),
			),
		)
		.limit(1);

	return ret;
}

export async function deleteBlock(id: string) {
	const block = await getBlockById(id);
	if (!block) {
		throw new NotFoundError("Block not found");
	}

	const [ret] = await db
		.delete(blocksTable)
		.where(eq(blocksTable.id, id))
		.returning(selectFields);

	return ret;
}
