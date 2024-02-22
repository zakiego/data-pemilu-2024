import { dprActions } from "@/actions/dpr";
import { presidenActions } from "@/actions/presiden";
import { getWilayah } from "@/actions/wilayah";
import { Command } from "commander";
import { z } from "zod";
import { partaiAction } from "@/actions/partai";
import { dpdActions } from "@/actions/dpd";

const program = new Command();

// ----------------- Options -----------------
program
  .description("Scrapper Pemilu 2024")
  .option("-c, --concurrent <number>", "Set number of concurrent request", "5")
  .option("-l, --limit <number>", "Set limit of request")
  .option("--no-dump", "Don't save file")
  .option("-d, --debug", "Debug mode")
  .parse();

export const options = z
  .object({
    concurrent: z.coerce.number(),
    limit: z.coerce.number().optional(),
    dump: z.boolean(),
    debug: z.boolean().optional(),
  })
  .parse(program.opts());

// ----------------- Partai -----------------
const partai = program.command("partai").description("Get data partai-partai");

partai
  .command("get-partai-list")
  .description("Get partai list")
  .action(async () => {
    await partaiAction.inserPartaiList();
  });

// ----------------- Wilayah -----------------

const wilayah = program
  .command("wilayah")
  .description(
    "Get data wilayah: Provinsi, Kabupaten/Kota, Kecamatan, Kelurahan, TPS",
  );

wilayah
  .command("get-wilayah")
  .description("Get wilayah")
  .action(async () => {
    await getWilayah();
  });

// ----------------- Pilpres -----------------
const presiden = program
  .command("presiden")
  .description("Get data penghitungan suara Presiden dan Wakil Presiden");

presiden
  .command("get-tps-detail")
  .description("Get TPS detail")
  .action(async () => {
    await presidenActions.insertTpsDetail();
  });

presiden
  .command("get-tps-detail-v2")
  .description("Get TPS detail v2")
  .action(async () => {
    await presidenActions.insertTpsDetailV2();
  });

presiden
  .command("update-tps-detail")
  .description("Update TPS detail")
  .action(async () => {
    await presidenActions.updateTpsDetail();
  });

// ----------------- DPR -----------------

const dpr = program
  .command("dpr")
  .description("Get data penghitungan suara DPR RI");

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

const dpd = program
  .command("dpd")
  .description("Get data penghitungan suara DPD");

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
