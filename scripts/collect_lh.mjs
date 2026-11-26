// Collect representative LH notice documents (공고문) for RAG prep.
// usage: node collect_lh.mjs <meta_dir> <out_dir>
import fs from "node:fs/promises";
import path from "node:path";

const [metaDir, outDir] = process.argv.slice(2);
const notices = JSON.parse(await fs.readFile(path.join(metaDir, "lh_notices_all.json"), "utf8"));
const PER_TYPE = { 행복주택: 3, 국민임대: 3, 영구임대: 2, 공공임대: 2, 통합공공임대: 1, 매입임대: 3, 분양주택: 2 };
const MAX_BYTES = 40 * 1024 * 1024;
const UA = { "User-Agent": "Mozilla/5.0 (jipsaseo data collector)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const pick = [];
for (const [type, n] of Object.entries(PER_TYPE)) {
	const cands = notices
		.filter((x) => x.ais_tp_cd_nm === type && !/정정공고/.test(x.pan_nm))
		.sort((a, b) => (b.pan_dt || "").localeCompare(a.pan_dt || ""));
	pick.push(...cands.slice(0, n));
}

await fs.mkdir(outDir, { recursive: true });
const manifest = [];
for (const n of pick) {
	const entry = { pan_id: n.pan_id, pan_nm: n.pan_nm, type: n.ais_tp_cd_nm, region: n.cnp_cd_nm, status: n.pan_ss, pan_dt: n.pan_dt, clsg_dt: n.clsg_dt, detail_url: n.detail_url, attachments: [], downloaded: null };
	try {
		const html = await (await fetch(n.detail_url, { headers: UA })).text();
		for (const m of html.matchAll(/fileDownLoad\('(\d+)'\);">([^<]+)<\/a>/g)) entry.attachments.push({ fileId: m[1], name: m[2].trim() });
		const isNotice = (a) => /공고/.test(a.name);
		const byExt = (re) => entry.attachments.find((a) => isNotice(a) && re.test(a.name));
		const chosen = byExt(/\.pdf$/i) || byExt(/\.hwpx?$/i) || entry.attachments.find((a) => /\.(pdf|hwpx?)$/i.test(a.name));
		if (chosen) {
			const res = await fetch(`https://apply.lh.or.kr/lhapply/lhFile.do?fileid=${chosen.fileId}`, { headers: UA });
			const buf = Buffer.from(await res.arrayBuffer());
			if (res.ok && buf.length > 1000 && buf.length <= MAX_BYTES) {
				const safe = `${n.ais_tp_cd_nm}_${n.pan_id}_${chosen.name}`.replace(/[\\/:*?"<>|]/g, "_").slice(0, 180);
				await fs.writeFile(path.join(outDir, safe), buf);
				entry.downloaded = { file: safe, bytes: buf.length, contentType: res.headers.get("content-type") };
			} else entry.downloaded = { error: `status=${res.status} bytes=${buf.length}` };
		}
	} catch (e) {
		entry.downloaded = { error: String(e) };
	}
	manifest.push(entry);
	console.log(`${entry.type} | ${entry.pan_nm.slice(0, 50)} | att=${entry.attachments.length} | ${entry.downloaded?.file ? `${(entry.downloaded.bytes / 1024).toFixed(0)}KB` : JSON.stringify(entry.downloaded)}`);
	await sleep(1200);
}
await fs.writeFile(path.join(metaDir, "manifest.json"), JSON.stringify(manifest, null, 1));
