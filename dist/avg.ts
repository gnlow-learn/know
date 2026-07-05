import { text } from "https://gnlow.dev/csvore@0.2.1"
import * as z from "https://esm.sh/zod@4.1.13"
import csv from "./avg.csv" with { type: "text" }

export const avg = text(csv).csv().parseRow(z.object({
    job: z.string(),
    popM: z.coerce.number(),
    popF: z.coerce.number(),
    peakAge: z.coerce.number(),
    meanAge: z.coerce.number(),
})).raw.toArray()
