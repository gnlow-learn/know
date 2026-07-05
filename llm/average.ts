import { text } from "https://gnlow.dev/csvore@0.2.1"
import * as z from "https://esm.sh/zod@4.1.13"

const csvs = (await Promise.all((await Array.fromAsync(Deno.readDir("llm/")))
    .map(x => "llm/"+x.name)
    .filter(x => x.endsWith(".csv"))
    .map(x => Deno.readTextFile(x))
)).map(x => text(x).csv().parseRow(z.object({
    job: z.string(),
    popM: z.coerce.number(),
    popF: z.coerce.number(),
    peakAge: z.coerce.number(),
    meanAge: z.coerce.number(),
})).raw.toArray())
.map(arr => {
    const popMSum = arr.map(x => x.popM).reduce((a,b)=>a+b)
    const popFSum = arr.map(x => x.popF).reduce((a,b)=>a+b)
    return arr.map(x => ({
        ...x,
        popM: 100*x.popM/popMSum,
        popF: 100*x.popF/popFSum,
    }))
})
const avg =
(ns: number[]) =>
    ns.reduce((a,b)=>a+b)/ns.length
const res = csvs[0].map((x, i) => ({
    job: x.job,
    popM: avg(csvs.map(x=>x[i].popM)).toFixed(3),
    popF: avg(csvs.map(x=>x[i].popF)).toFixed(3),
    peakAge: Math.round(avg(csvs.map(x=>x[i].peakAge))),
    meanAge: Math.round(avg(csvs.map(x=>x[i].meanAge))),
}))

console.log(res[400])

const csv = Object.keys(res[0]).join(",")+"\n"+
    res.map(x => Object.values(x).join(","))
        .join("\n")
await Deno.writeTextFile("dist/avg.csv", csv)
