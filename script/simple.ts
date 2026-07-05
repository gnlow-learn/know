await Deno.writeTextFile("dist/simple.txt",
    (await Deno.readTextFile("orig/직업세세분류.csv"))
        .split("\n")
        .slice(1)
        .map(x => x.split(",").at(-1)!)
        .join("\n")
)
