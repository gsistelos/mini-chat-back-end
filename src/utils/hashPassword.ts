import { createHash } from "node:crypto";

export function hashPassword(password: string) {
	return createHash("sha256").update(password).digest("hex");
}
