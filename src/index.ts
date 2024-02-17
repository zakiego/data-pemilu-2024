import { dprActions } from "@/actions/dpr";
import { presidenActions } from "@/actions/presiden";
import { getWilayah } from "@/actions/get-wilayah";
import { Command } from "commander";
import { z } from "zod";
import { partaiAction } from "@/actions/partai";

const program = new Command();

// ----------------- Options -----------------
program
  .option("-c, --concurrent <number>", "Concurrent", "5")
  .option("-l, --limit <number>", "Set limit")
  .parse();

export const options = z
  .object({
    concurrent: z.coerce.number(),
    limit: z.coerce.number().optional(),
  })
  .parse(program.opts());

// ----------------- Partai -----------------
const partai = program.command("partai").description("Partai");

partai
  .command("get-partai-list")
  .description("Get partai list")
  .action(async () => {
    await partaiAction.inserPartaiList();
  });

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
    await presidenActions.insertTpsDetail();
  });

pilpres
  .command("get-tps-detail-v2")
  .description("Get TPS detail v2")
  .action(async () => {
    await presidenActions.insertTpsDetailV2();
  });

pilpres
  .command("update-tps-detail")
  .description("Update TPS detail")
  .action(async () => {
    await presidenActions.updateTpsDetail();
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

dpr
  .command("insert-dapil-list")
  .description("Insert Dapil")
  .action(async () => {
    await dprActions.insertDapilList();
  });

program.parse();
