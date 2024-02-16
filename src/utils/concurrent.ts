import { options } from "@/index";
import ConcurrentManager from "concurrent-manager";

export const createConcurrentManager = () => {
  console.log(
    `Creating concurrent manager with concurrent: ${options.concurrent}`,
  );
  const concurrent = new ConcurrentManager({
    concurrent: options.concurrent,
    withMillis: true,
  });
  return concurrent;
};
