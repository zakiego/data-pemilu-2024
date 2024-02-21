import { options } from "@/index";
import cliProgress from "cli-progress";

// create a new progress bar instance and use shades_classic theme
export const initCli = ({ total }: { total: number }) => {
  const cli = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  cli.start(total, 0);
  return cli;
};
