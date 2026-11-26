// Build an ASCII-named RAG corpus from data/notices + data/laws.
// Works around an AutoRAG/MinSync native crash on Windows with non-ASCII file names.
// usage: node build_corpus.mjs <dataDir>
import fs from "node:fs/promises";
import path from "node:path";

const dataDir = process.argv[2];
const corpus = path.join(dataDir, "corpus");
await fs.rm(corpus, { recursive: true, force: true });
await fs.mkdir(path.join(corpus, "notices"), { recursive: true });
await fs.mkdir(path.join(corpus, "laws"), { recursive: true });

const TYPE_EN = { 행복주택: "happy-house", 국민임대: "national-rental", 영구임대: "permanent-rental", 공공임대: "public-rental", 통합공공임대: "integrated-public-rental", 매입임대: "purchase-rental", 분양주택: "public-sale" };
const manifest = JSON.parse(await fs.readFile(path.join(dataDir, "meta", "manifest.json"), "utf8"));
const map = [];
for (const e of manifest) {
	if (!e.downloaded?.file) continue;
	const ext = path.extname(e.downloaded.file).toLowerCase();
	const ascii = `${TYPE_EN[e.type] ?? "other"}_${e.pan_id}${ext}`;
	await fs.copyFile(path.join(dataDir, "notices", e.downloaded.file), path.join(corpus, "notices", ascii));
	map.push({ corpus: `notices/${ascii}`, original: `notices/${e.downloaded.file}`, title: e.pan_nm, type: e.type, region: e.region, pan_id: e.pan_id, clsg_dt: e.clsg_dt, detail_url: e.detail_url });
}

const LAWS = {
	"주택공급에_관한_규칙.md": "housing-supply-rule.md",
	"공공주택_특별법_시행규칙.md": "public-housing-act-enforcement-rule.md",
	"공공주택_업무처리지침.md": "public-housing-guideline.md",
	"공공임대주택_예비입주자_업무처리지침.md": "public-rental-waitlist-guideline.md",
};
for (const [ko, en] of Object.entries(LAWS)) {
	let md = await fs.readFile(path.join(dataDir, "laws", ko), "utf8");
	const before = md.length;
	// Drop 서식 (application forms): not needed for eligibility reasoning.
	md = md.replace(/### \[서식[^\]]*\][\s\S]*?(?=\n### |\n## |$)/g, "");
	// Collapse padding inside box-drawing tables and trailing spaces.
	md = md.split("\n").map((l) => l.replace(/ {2,}/g, " ").replace(/\s+$/, "")).join("\n").replace(/\n{3,}/g, "\n\n");
	await fs.writeFile(path.join(corpus, "laws", en), md, "utf8");
	map.push({ corpus: `laws/${en}`, original: `laws/${ko}`, title: md.split("\n")[0].replace(/^# /, ""), bytes_before: Buffer.byteLength(before > 0 ? "x".repeat(0) : "") || undefined, chars_before: before, chars_after: md.length });
}
await fs.writeFile(path.join(corpus, "corpus_map.json"), JSON.stringify(map, null, 1));
for (const m of map) console.log(m.corpus, "<-", m.title.slice(0, 50), m.chars_after ? `(${m.chars_before} -> ${m.chars_after} chars)` : "");
