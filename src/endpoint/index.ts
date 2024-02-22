import { dpd } from "@/endpoint/dpd";
import { dpr } from "@/endpoint/dpr";
import { dprdKabupatenKota } from "@/endpoint/dprd-kab-kota";
import { dprdProvinsi } from "@/endpoint/dprd-provinsi";
import { partai } from "@/endpoint/partai";
import { presiden } from "@/endpoint/presiden";
import { wilayah } from "@/endpoint/wilayah";

export const ENDPOINT_FUNCTION = {
  presiden,
  dpr,
  dprdProvinsi,
  dprdKabupatenKota,
  dpd,
  partai,
  wilayah,
};
