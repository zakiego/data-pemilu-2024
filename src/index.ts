import { getWilayah } from "@/actions/get-wilayah";

const args = process.argv;
const command = args[2];

switch (command) {
	case "get-wilayah":
		await getWilayah();
		break;
	default:
		console.log("Command not recognized");
		break;
}
