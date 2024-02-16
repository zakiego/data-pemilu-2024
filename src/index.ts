import {
  getTpsDetail,
  getTpsDetailV2,
  updateTpsDetail,
} from "@/actions/get-tps-detail";
import { getWilayah } from "@/actions/get-wilayah";

const args = process.argv;
const election = args[2] as Election;
const command = args[3];

type Election = "pilpres" | "dpr" | "dpd" | "dprd-prov" | "dprd-kabkot";

switch (election) {
  case "pilpres":
    switch (command) {
      case "get-wilayah":
        await getWilayah();
        break;
      case "get-tps-detail":
        await getTpsDetail();
        break;
      case "get-tps-detail-2":
        await getTpsDetailV2();
        break;
      case "update-tps-detail":
        await updateTpsDetail();
        break;
      default:
        console.log("Command not recognized");
        break;
    }
    break;
  case "dpr":
  case "dpd":
  case "dprd-prov":
  case "dprd-kabkot":
}
