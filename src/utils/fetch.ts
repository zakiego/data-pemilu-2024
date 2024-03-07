import { options } from "@/index";
import { logger } from "@/utils/log";
import type { z } from "zod";

export const strictFetch = async <T>(
  url: string,
  schema: z.Schema<T>,
): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      Referer: "https://pemilu2024.kpu.go.id",
    },
  });

  if (!response.ok) {
    logger.error(`Failed to fetch ${url}`, response);
    throw new Error(`Failed to fetch ${url}`);
  }

  const data = await response.json();

  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    console.log(`Parsing error for ${url}`, parsed.error);
    logger.error(`Parsing error for ${url}`, parsed.error);
    throw new Error(`Parsing error for ${url}`, parsed.error);
  }

  await saveFile({ data, url });

  return parsed.data;
};

type SaveFile = {
  data: unknown;
  url: string;
};

const saveFile = async ({ data, url }: SaveFile) => {
  const isValidUrl = url.startsWith("https://sirekap-obj-data.kpu.go.id");

  if (!isValidUrl) {
    throw new Error("Invalid url");
  }

  const fileName = url.replace("https://sirekap-obj-data.kpu.go.id", "");

  try {
    if (options.dump === true) {
      await Bun.write(`dump/${fileName}`, JSON.stringify(data, null, 2), {
        createPath: true,
      });
      logger.info(`Saved file ${fileName}`);
    }
  } catch (error) {
    logger.error(`Failed to save file ${fileName}`, error);
  }
};
