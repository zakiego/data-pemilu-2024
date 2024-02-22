import {
  pdpdCalonList,
  pdpdTpsAdministrasi,
  pdpdTpsChart,
  pdpdTpsList,
} from "@/db/schema/dpd";
import { pdprDapilCalonList, pdprDapilList, pdprTps } from "@/db/schema/dpr";
import { partai } from "@/db/schema/partai";
import {
  ppwpKabupatenKota,
  ppwpKecamatan,
  ppwpKelurahanDesa,
  ppwpNasional,
  ppwpProvinsi,
  ppwpTps,
} from "@/db/schema/presiden";
import { wilayah } from "@/db/schema/wilayah";

export const dbSchema = {
  wilayah,

  pdprTps,
  pdprDapilList,
  pdprDapilCalonList,
  partai,

  // ----------------- Presiden -----------------
  ppwpNasional,
  ppwpProvinsi,
  ppwpKabupatenKota,
  ppwpKecamatan,
  ppwpKelurahanDesa,
  ppwpTps,

  // ----------------- DPD -----------------
  pdpdTpsList,
  pdpdCalonList,
  pdpdTpsAdministrasi,
  pdpdTpsChart,
};
