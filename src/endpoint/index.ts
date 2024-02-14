import { dpd } from "@/endpoint/dpd";
import { dpr } from "@/endpoint/dpr";
import { dprdKabupatenKota } from "@/endpoint/dprd-kab-kota";
import { dprdProvinsi } from "@/endpoint/dprd-provinsi";
import { pilpres } from "@/endpoint/pilpres";

export const ENDPOINT_FUNCTION = {
  pilpres,
  dpr,
  dprdProvinsi,
  dprdKabupatenKota,
  dpd,
};
