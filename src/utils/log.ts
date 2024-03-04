import { options } from "@/index";
import pino, { destination } from "pino";

const transport = pino.transport({
  targets: [
    {
      level: "trace",
      target: "pino/file",
      options: {
        destination: "./file.log",
      },
    },
    // {
    //   level: "error",
    //   target: "pino-pretty",
    //   options: {},
    // },
  ],
});

export const logger = pino({}, transport);
