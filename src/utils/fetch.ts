import { logger } from "@/utils/log";
import type { z } from "zod";

export const strictFetch = async <T>(
	url: string,
	schema: z.Schema<T>,
): Promise<T> => {
	const response = await fetch(url);

	if (!response.ok) {
		logger.error(`Failed to fetch ${url}`, response);
		throw new Error(`Failed to fetch ${url}`);
	}

	const data = await response.json();

	const parsed = schema.safeParse(data);

	if (!parsed.success) {
		logger.error(`Parsing error for ${url}`, parsed.error);
		throw new Error(`Parsing error for ${url}`, parsed.error);
	}

	return parsed.data;
};
