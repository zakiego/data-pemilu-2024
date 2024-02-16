import { dprActions } from "@/actions/dpr";
import {
  getTpsDetail,
  getTpsDetailV2,
  updateTpsDetail,
} from "@/actions/get-tps-detail";
import { getWilayah } from "@/actions/get-wilayah";
import { Command } from "commander";
import { z } from "zod";

const program = new Command();

// ----------------- Options -----------------
program.option("-c, --concurrent <number>", "Concurrent", "5").parse();
export const options = z
  .object({
    concurrent: z.coerce.number(),
  })
  .parse(program.opts());

// ----------------- Pilpres -----------------
const pilpres = program.command("pilpres").description("Pilpres");

pilpres
  .command("get-wilayah")
  .description("Get wilayah")
  .action(async () => {
    await getWilayah();
  });

pilpres
  .command("get-tps-detail")
  .description("Get TPS detail")
  .action(async () => {
    await getTpsDetail();
  });

pilpres
  .command("get-tps-detail-v2")
  .description("Get TPS detail v2")
  .action(async () => {
    await getTpsDetailV2();
  });

pilpres
  .command("update-tps-detail")
  .description("Update TPS detail")
  .action(async () => {
    await updateTpsDetail();
  });

// ----------------- DPR -----------------

const dpr = program.command("dpr").description("DPR");

dpr
  .command("insert-tps-detail")
  .description("Insert TPS detail")
  .action(async () => {
    await dprActions.insertTpsDetailV2();
  });

dpr
  .command("update-tps-detail")
  .description("Update TPS detail")
  .action(async () => {
    await dprActions.updateTpsDetail();
  });

program.parse();
