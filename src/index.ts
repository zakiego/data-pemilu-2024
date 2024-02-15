import {
  getTpsDetail,
  getTpsDetailV2,
  updateTpsDetail,
} from "@/actions/get-tps-detail";
import { getWilayah } from "@/actions/get-wilayah";

const args = process.argv;
const command = args[2];

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
