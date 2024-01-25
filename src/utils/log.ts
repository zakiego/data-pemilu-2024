import pino, { destination } from "pino";

const transport = pino.transport({
  targets: [
    {
      level: "trace",
      target: "pino/file",
      options: {
        destination: "./logs/file.log",
      },
    },
    {
      level: "trace",
      target: "pino-pretty",
      options: {},
    },
  ],
});

export const logger = pino({}, transport);
