// Convert k-skill korean-law detail JSON (법령 or 행정규칙) to Markdown for RAG.
// usage: node law_to_md.mjs <in.json> <out.md> <title> <source_url>
import fs from "node:fs/promises";

const [inFile, outFile, title, sourceUrl] = process.argv.slice(2);
const raw = JSON.parse(await fs.readFile(inFile, "utf8"));
const lines = [`# ${title}`, "", `> 출처: ${sourceUrl}`, `> 수집일: 2026-11-26 (국가법령정보센터 Open API, k-skill-proxy 경유)`, ""];

const texts = (v) => {
	const out = [];
	const walk = (x, key = "") => {
		if (x == null) return;
		if (typeof x === "string") {
			if (/내용$/.test(key) || key === "") out.push(x);
			return;
		}
		if (Array.isArray(x)) return x.forEach((y) => walk(y, key));
		for (const [k, val] of Object.entries(x)) {
			if (/(키|번호|일자|여부|이동|링크|파일명|구분)$/.test(k) && typeof val === "string") continue;
			walk(val, k);
		}
	};
	walk(v);
	return out.map((s) => s.replace(/\s+$/g, "")).filter((s) => s.trim());
};

const law = raw.법령;
if (law) {
	const info = law.기본정보 || {};
	lines.push(`- 법령구분: ${info.법종구분?.content ?? info.법종구분 ?? ""}`, `- 시행일자: ${info.시행일자 ?? ""}`, `- 소관부처: ${info.소관부처?.content ?? info.소관부처 ?? ""}`, "");
	for (const jo of [].concat(law.조문?.조문단위 ?? [])) {
		const t = texts(jo);
		if (!t.length) continue;
		if (jo.조문여부 === "전문") lines.push("", `## ${t[0].trim()}`, "");
		else lines.push(...t.map((s) => s.trim()), "");
	}
	const bs = [].concat(law.별표?.별표단위 ?? []);
	if (bs.length) lines.push("", "## 별표", "");
	for (const b of bs) {
		lines.push(`### [${b.별표구분 ?? "별표"} ${b.별표번호 ?? ""}] ${b.별표제목 ?? ""}`, "", "```text");
		for (const s of texts(b.별표내용)) lines.push(s);
		lines.push("```", "");
	}
} else {
	const rule = raw.AdmRulService ?? raw.행정규칙 ?? raw;
	for (const s of texts(rule)) lines.push(s.trim(), "");
}
await fs.writeFile(outFile, `${lines.join("\n")}\n`, "utf8");
console.log(outFile, lines.length, "lines");
