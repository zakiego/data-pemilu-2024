import { getTpsDetail } from "@/actions/get-tps-detail";
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
  default:
    console.log("Command not recognized");
    break;
}
