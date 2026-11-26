// Smoke-test data.go.kr APIs with the key from <envFile>. Never prints the key.
// usage: node test_apis.mjs <envFile> <outDir>
import fs from "node:fs/promises";
import path from "node:path";

const [envFile, outDir] = process.argv.slice(2);
const env = Object.fromEntries((await fs.readFile(envFile, "utf8")).split(/\r?\n/).filter((l) => l.includes("=")).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]));
const KEY = env.DATA_GO_KR_API_KEY;
if (!KEY) throw new Error("DATA_GO_KR_API_KEY missing");
await fs.mkdir(outDir, { recursive: true });

const lhList = await (async () => {
	const u = `https://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1?serviceKey=${KEY}&PG_SZ=5&PAGE=1&UPP_AIS_TP_CD=06&PAN_SS=${encodeURIComponent("공고중")}`;
	return u;
})();

const tests = [
	["01_LH_공고목록", lhList],
	["02_LH_상세정보", `https://apis.data.go.kr/B552555/lhLeaseNoticeDtlInfo1/getLeaseNoticeDtlInfo1?serviceKey=${KEY}&PAN_ID=2015122300021128&CCR_CNNT_SYS_DS_CD=03&SPL_INF_TP_CD=063&UPP_AIS_TP_CD=06&AIS_TP_CD=10`],
	["03_LH_공급정보", `https://apis.data.go.kr/B552555/lhLeaseNoticeSplInfo1/getLeaseNoticeSplInfo1?serviceKey=${KEY}&PAN_ID=2015122300021128&CCR_CNNT_SYS_DS_CD=03&SPL_INF_TP_CD=063&UPP_AIS_TP_CD=06&AIS_TP_CD=10`],
	["04_마이홈_임대모집공고", `https://apis.data.go.kr/1613000/HWSPR02/rsdtRcritNtcList?serviceKey=${KEY}&pageNo=1&numOfRows=5`],
	["05_마이홈_분양모집공고", `https://apis.data.go.kr/1613000/HWSPR02/ltRsdtRcritNtcList?serviceKey=${KEY}&pageNo=1&numOfRows=5`],
	["06_LH_커트라인", `https://apis.data.go.kr/B552555/lhCsrLsPwiPneScrInfo/getCsrLsPwiPneScrInfo?serviceKey=${KEY}&pageNo=1&numOfRows=5`],
	["07_마이홈_대기현황", `https://apis.data.go.kr/1613000/HWSPR03/moveWaitStsList?serviceKey=${KEY}&pageNo=1&numOfRows=5`],
	["08_청약홈_경쟁률", `https://api.odcloud.kr/api/ApplyhomeStatSvc/v1/getAPTCmpetrtAreaStat?serviceKey=${KEY}&page=1&perPage=5`],
];

for (const [name, url] of tests) {
	try {
		const res = await fetch(url, { headers: { Accept: "application/json" } });
		const body = await res.text();
		await fs.writeFile(path.join(outDir, `${name}.txt`), body);
		const oneLine = body.replace(/\s+/g, " ").replaceAll(KEY, "<KEY>");
		console.log(`${name} | http=${res.status} | bytes=${body.length} | ${oneLine.slice(0, 260)}`);
	} catch (e) {
		console.log(`${name} | ERROR ${String(e).replaceAll(KEY, "<KEY>")}`);
	}
}
