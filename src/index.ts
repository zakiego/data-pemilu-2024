import { dprActions } from "@/actions/dpr";
import { presidenActions } from "@/actions/presiden";
import { getWilayah } from "@/actions/get-wilayah";
import { Command } from "commander";
import { z } from "zod";
import { partaiAction } from "@/actions/partai";
import { dpdActions } from "@/actions/dpd";

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

dpr
  .command("get-dapil-calon-list")
  .description("Get Dapil Calon List")
  .action(async () => {
    await dprActions.getDapilCalonList();
  });

dpr
  .command("update-dapil-calon-detail")
  .description("Update Dapil Calon Detail")
  .action(async () => {
    await dprActions.updateDapilCalonDetail();
  });

// ----------------- DPD -----------------

const dpd = program.command("dpd").description("DPD");

dpd
  .command("init-tps-list")
  .description("Init TPS List")
  .action(async () => {
    await dpdActions.initTpsList();
  });

dpd
  .command("get-calon-list")
  .description("Get Calon List")
  .action(async () => {
    await dpdActions.getCalonList();
  });

dpd
  .command("get-tps-detail")
  .description("Get TPS Detail")
  .action(async () => {
    await dpdActions.getTpsDetail();
  });

program.parse();
