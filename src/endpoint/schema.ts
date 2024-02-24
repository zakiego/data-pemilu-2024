import { z } from "zod";

export const psuEnum = z.enum([
  "Reguler",
  "Pemungutan Suara Ulang",
  "Penghitungan Suara Ulang",
  "Pemungutan Suara Susulan",
  "Pemungutan Suara Lanjutan",
]);
