import { z } from "zod";

export const psuEnum = z.enum([
  "Reguler",
  "Penghitungan Suara Ulang",
  "Penghitungan Suara Susulan",
  "Pemungutan Suara Ulang",
  "Pemungutan Suara Susulan",
  "Pemungutan Suara Lanjutan",
]);
