import { options } from "@/index";
import cliProgress from "cli-progress";

export const initCli = ({ total }: { total: number }) => {
  const cli = new cliProgress.SingleBar(
    {
      stopOnComplete: true,
      stream: process.stdout,
      noTTYOutput: true,
      notTTYSchedule: 10_000, // 10 seconds
    },
    cliProgress.Presets.shades_classic,
  );
  cli.start(total, 0);
  return cli;
};
