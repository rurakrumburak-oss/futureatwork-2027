// Buduje stronę do katalogu dist/: kopiuje pliki z src/, dodaje lokalne fonty
// i generuje grafiki (podgląd do social mediów i ikonę dla iOS).
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const OUT = "dist";
await rm(OUT, { recursive: true, force: true });
await cp("src", OUT, { recursive: true });

// Fonty do strony (woff2, zmienna grubość)
await mkdir(`${OUT}/fonts`, { recursive: true });
const webFonts = [
  ["@fontsource-variable/bricolage-grotesque", "bricolage-grotesque-latin-wght-normal.woff2"],
  ["@fontsource-variable/bricolage-grotesque", "bricolage-grotesque-latin-ext-wght-normal.woff2"],
  ["@fontsource-variable/instrument-sans", "instrument-sans-latin-wght-normal.woff2"],
  ["@fontsource-variable/instrument-sans", "instrument-sans-latin-ext-wght-normal.woff2"],
];
for (const [pkg, file] of webFonts) {
  await cp(`node_modules/${pkg}/files/${file}`, `${OUT}/fonts/${file}`);
}
await cp("node_modules/@fontsource-variable/bricolage-grotesque/LICENSE", `${OUT}/fonts/LICENSE-bricolage-grotesque.txt`).catch(() => {});
await cp("node_modules/@fontsource-variable/instrument-sans/LICENSE", `${OUT}/fonts/LICENSE-instrument-sans.txt`).catch(() => {});

// Fonty do generowania grafik (satori obsługuje woff, nie woff2)
const f = (w, sub) => readFile(`node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-${sub}-${w}-normal.woff`);
const fonts = [];
for (const w of [600, 800]) {
  fonts.push({ name: "Bricolage", data: await f(w, "latin"), weight: w, style: "normal" });
  fonts.push({ name: "Bricolage", data: await f(w, "latin-ext"), weight: w, style: "normal" });
}

const C = { fog: "#EEF1F6", ink: "#16203A", soft: "#4A5470", cobalt: "#2F45D8", signal: "#FFD23F" };
const h = (type, style, children) => ({ type, props: { style, children } });

async function png(tree, width, height, path) {
  const svg = await satori(tree, { width, height, fonts });
  const out = new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
  await writeFile(path, out);
}

// Podgląd 1200x630 do linków (Facebook, LinkedIn, Messenger, X)
await png(
  h("div", { width: "100%", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", background: C.fog, padding: "56px 72px 60px", fontFamily: "Bricolage", color: C.ink }, [
    h("div", { display: "flex", flexDirection: "column" }, [
      h("div", { display: "flex", height: 140, alignItems: "center", fontSize: 160, fontWeight: 800, letterSpacing: -6 }, "FUTURE"),
      h("div", { display: "flex", height: 160, alignItems: "center", fontSize: 160, fontWeight: 800, letterSpacing: -6 }, [
        h("span", { display: "flex", color: C.cobalt, fontSize: 196 }, "@"),
        h("span", { display: "flex" }, "WORK"),
        h("span", { display: "flex", alignSelf: "flex-start", fontSize: 56, fontWeight: 600, color: C.soft, letterSpacing: -1, marginLeft: 18 }, "2027"),
      ]),
    ]),
    h("div", { display: "flex", alignItems: "center", justifyContent: "space-between" }, [
      h("div", { display: "flex", flexDirection: "column", fontSize: 34, fontWeight: 600, lineHeight: 1.25 }, [
        h("span", {}, "30 stycznia 2027, godz. 15:00"),
        h("span", { color: C.soft }, "Centrum Konferencyjne West Gate, Warszawa"),
      ]),
      h("div", { display: "flex", background: C.signal, color: C.ink, borderRadius: 999, padding: "16px 30px", fontSize: 30, fontWeight: 800 }, "20 paneli"),
    ]),
  ]),
  1200, 630, `${OUT}/og.png`
);

// Ikona na ekran główny iOS
await png(
  h("div", { width: 180, height: 180, display: "flex", alignItems: "center", justifyContent: "center", background: C.cobalt, fontFamily: "Bricolage" }, [
    h("span", { color: C.signal, fontSize: 150, fontWeight: 800, lineHeight: 1, marginTop: -14 }, "@"),
  ]),
  180, 180, `${OUT}/apple-touch-icon.png`
);

console.log("Gotowe: dist/");
