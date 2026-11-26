// Check the eligibility eval set: every evidence quote must appear verbatim in the parsed notice,
// every persona x notice pair must have exactly one case, and verdicts must use the allowed labels.
// usage: node scripts/check_eval_evidence.mjs [evalDir] [parsedDir]
//   evalDir   default: eval
//   parsedDir default: workspace/.autorag/minsync/files  (AutoRAG parse output, "<corpus_file>.md")
import fs from "node:fs";
import path from "node:path";

const evalDir = process.argv[2] ?? "eval";
const parsedDir = process.argv[3] ?? path.join("workspace", ".autorag", "minsync", "files");
const read = (name) => JSON.parse(fs.readFileSync(path.join(evalDir, name), "utf8").replace(/^﻿/, ""));
const personas = read("personas.json");
const notices = read("notices.json");
const cases = read("eligibility_cases.json");

const VERDICTS = new Set(["가능", "불가", "확인필요"]);
const cache = new Map();
const linesOf = (file) => {
	if (!cache.has(file)) cache.set(file, fs.readFileSync(path.join(parsedDir, `${file}.md`), "utf8").split(/\r?\n/));
	return cache.get(file);
};
const fileOf = Object.fromEntries(notices.map((n) => [n.id, n.corpus_file]));

const problems = [];
const warnings = [];
let quotes = 0;
const seen = new Set();
for (const c of cases) {
	if (seen.has(c.id)) problems.push(`${c.id}: duplicate case`);
	seen.add(c.id);
	if (!VERDICTS.has(c.expected?.verdict)) problems.push(`${c.id}: unknown verdict "${c.expected?.verdict}"`);
	if (!c.reasons?.length) problems.push(`${c.id}: no reasons`);
	for (const [i, r] of (c.reasons ?? []).entries()) {
		const e = r.evidence;
		quotes++;
		if (e.file !== fileOf[c.notice_id]) problems.push(`${c.id} reason ${i + 1}: evidence file ${e.file} is not the case's notice`);
		const lines = linesOf(e.file);
		if (lines[e.line - 1]?.includes(e.quote)) continue;
		const found = lines.findIndex((l) => l.includes(e.quote));
		if (found >= 0) warnings.push(`${c.id} reason ${i + 1}: quote is at line ${found + 1}, not ${e.line}`);
		else problems.push(`${c.id} reason ${i + 1}: quote not found in ${e.file}: ${e.quote.slice(0, 60)}`);
	}
}
for (const p of personas) for (const n of notices) if (!seen.has(`${p.id}-${n.id}`)) problems.push(`${p.id}-${n.id}: case missing`);

const dist = {};
for (const c of cases) dist[c.expected.verdict] = (dist[c.expected.verdict] ?? 0) + 1;
console.log(`personas=${personas.length} notices=${notices.length} cases=${cases.length} quotes=${quotes}`);
console.log(`verdicts ${JSON.stringify(dist)}`);
for (const w of warnings) console.log(`WARN ${w}`);
for (const p of problems) console.log(`FAIL ${p}`);
console.log(problems.length ? `FAILED: ${problems.length} problem(s)` : `OK: all quotes found${warnings.length ? `, ${warnings.length} line warning(s)` : ""}`);
process.exitCode = problems.length ? 1 : 0;
