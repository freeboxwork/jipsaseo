# 집사서 RAG 데이터 (2026-11-26 수집)

> 집사서의 RAG 검색 대상 데이터입니다. 모두 공개된 공고문, 법령, 공공데이터입니다.

## 폴더 구성

| 폴더 | 내용 | 출처 |
|---|---|---|
| `notices/` | LH 모집공고문 PDF 16건 (8개 공급 유형) | LH 청약플러스 공고 상세 첨부파일 (`apply.lh.or.kr`) |
| `laws/` | 자격 기준 법령·지침 4건 (Markdown) | 국가법령정보센터 Open API (k-skill-proxy 경유) |
| `meta/` | LH 공고 목록 원본 JSON (87건), 다운로드 manifest, 법령 원본 JSON | LH 공고 Open API (k-skill-proxy 경유) |

## 공고문 목록 (`notices/`)

| 유형 | 공고명 | 지역 | 상태 | 마감 | 파일 |
|---|---|---|---|---|---|
| 행복주택 | [완주삼례A-1 행복주택 입주자격완화 입주자 모집(동호지정,선계약후검증)](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=2015122300021128&ccrCnntSysDsCd=03&uppAisTpCd=06&aisTpCd=10&mi=1026) | 전북특별자치도 | 공고중 | 2026.12.31 | ✅ PDF 723KB |
| 행복주택 | [수원시지역 호매실21단지, 고등2단지 행복주택 입주자격완화[선계약 후검증] 입주자 모집(2026.11.23)](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=2015122300021130&ccrCnntSysDsCd=03&uppAisTpCd=06&aisTpCd=10&mi=1026) | 경기도 | 공고중 | 2026.12.04 | ✅ PDF 653KB |
| 행복주택 | [인천논현 LH16단지 (인천논현4 1블록) 창업지원주택 입주자 모집[인정업종 확대, 선착순동호지정, 선계약후검증](입주자모집공고일 : 2026.11.19.)](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=2015122300021121&ccrCnntSysDsCd=03&uppAisTpCd=06&aisTpCd=10&mi=1026) | 인천광역시 | 공고중 | 2026.12.02 | ✅ PDF 722KB |
| 국민임대 | [[선계약후검증]이천갈산3 국민임대주택 추가 모집](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=2015122300021124&ccrCnntSysDsCd=03&uppAisTpCd=06&aisTpCd=07&mi=1026) | 경기도 | 공고중 | 2026.12.04 | ✅ PDF 557KB |
| 국민임대 | [학익 SK VIEW(학익 1구역 주택재개발정비사업) 국민임대주택 입주자 모집 공고(당해 사업지구 철거민)](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=2015122300021117&ccrCnntSysDsCd=03&uppAisTpCd=06&aisTpCd=07&mi=1026) | 인천광역시 | 공고중 | 2026.12.03 | ✅ PDF 424KB |
| 국민임대 | [대구금호5 국민임대주택 입주자격 완화 동호지정 입주자모집](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=2015122300021103&ccrCnntSysDsCd=03&uppAisTpCd=06&aisTpCd=07&mi=1026) | 대구광역시 | 공고중 | 2026.12.03 | ✅ PDF 703KB |
| 영구임대 | [영월주천 고령자복지주택 예비입주자 모집](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=2015122300021133&ccrCnntSysDsCd=03&uppAisTpCd=06&aisTpCd=09&mi=1026) | 강원특별자치도 | 공고중 | 2026.12.16 | ✅ PDF 845KB |
| 영구임대 | [옹진백령 영구임대(마을정비형) 예비입주자 모집 공고](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=2015122300021055&ccrCnntSysDsCd=03&uppAisTpCd=06&aisTpCd=09&mi=1026) | 인천광역시 | 공고중 | 2026.12.09 | ✅ PDF 816KB |
| 공공임대 | [익산어양4단지 50년 공공임대주택 예비입주자 모집](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=2015122300021129&ccrCnntSysDsCd=03&uppAisTpCd=06&aisTpCd=08&mi=1026) | 전북특별자치도 | 공고중 | 2026.12.09 | ✅ PDF 951KB |
| 공공임대 | [파주운정A4BL(별하람3) 10년 공공임대주택리츠 예비입주자 모집(무순위)](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=0000061212&ccrCnntSysDsCd=02&uppAisTpCd=06&aisTpCd=08&mi=1026) | 경기도 | 접수중 | 2026.11.26 | ✅ PDF 363KB |
| 통합공공임대 | [충북혁신클러스터 통합공공임대(일자리연계형 지원주택)](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=2015122300021132&ccrCnntSysDsCd=03&uppAisTpCd=06&aisTpCd=48&mi=1026) | 충청북도 | 공고중 | 2026.12.11 | ✅ PDF 1035KB |
| 매입임대 | [충북지역본부[음성군] 든든전세주택 입주자 모집공고(분양전환형)](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=2015122300021136&ccrCnntSysDsCd=03&uppAisTpCd=13&aisTpCd=26&mi=1026) | 충청북도 | 공고중 | 2026.12.09 | ✅ PDF 827KB |
| 매입임대 | [[광주전남지역본부] 고령자 매입임대주택 예비입주자 모집](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=2015122300021127&ccrCnntSysDsCd=03&uppAisTpCd=13&aisTpCd=26&mi=1026) | 전국 | 공고중 | 2026.12.11 | ✅ PDF 756KB |
| 매입임대 | [[전남광주통합특별시] 일반 매입임대주택 예비입주자 모집 공고](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=2015122300021126&ccrCnntSysDsCd=03&uppAisTpCd=13&aisTpCd=26&mi=1026) | 전남광주통합특별시 | 공고중 | 2026.12.11 | ✅ PDF 817KB |
| 분양주택 | [의정부우정 A-1블록 공공분양주택 잔여세대 추가입주자모집공고(순번추첨 동호지정)](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=0000061211&ccrCnntSysDsCd=02&uppAisTpCd=05&aisTpCd=05&mi=1027) | 경기도 | 공고중 | 2026.12.10 | ✅ PDF 367KB |
| 분양주택 | [원주무실 A-2블록 공공분양 잔여세대 추가 입주자모집 공고(순번추첨 동호지정 및 선착순)](https://apply.lh.or.kr/lhapply/apply/wt/wrtanc/selectWrtancInfo.do?panId=0000061207&ccrCnntSysDsCd=02&uppAisTpCd=05&aisTpCd=05&mi=1027) | 강원특별자치도 | 접수중 | 2026.11.27 | ✅ PDF 280KB |

## 법령·지침 (`laws/`)

| 파일 | 내용 | 시행일 |
|---|---|---|
| `주택공급에_관한_규칙.md` | 청약 일반·특별공급, 가점제(별표 1), 예치금(별표 2) | 2026-11-24 |
| `공공주택_특별법_시행규칙.md` | 공공임대 입주자 자격, 소득·자산 기준 별표 | 2026-11-13 |
| `공공주택_업무처리지침.md` | 유형별 입주자 선정 기준, 소득 구간, 순위 (실무 기준) | **2026-11-29** |
| `공공임대주택_예비입주자_업무처리지침.md` | 예비입주자 관리 | 2026-07-08 |

## 갱신 방법

- 공고 목록: `https://k-skill-proxy.nomadamas.org/v1/lh-notice/search?category=06&status=접수중` (키 불필요)
  - category: `05` 분양주택, `06` 임대주택, `13` 주거복지
- 공고문 파일: 공고 상세 페이지의 `fileDownLoad('ID')` → `https://apply.lh.or.kr/lhapply/lhFile.do?fileid=ID`
- 법령: `https://k-skill-proxy.nomadamas.org/v1/korean-law/detail?target=law&MST=<법령일련번호>`

## 알려진 한계

- SH, GH 등 지방 공사 공고는 아직 없습니다.
- 공고문의 소득·자산 기준 금액은 매년 바뀝니다. 공고문에 적힌 해당 연도 금액이 우선합니다.
- `공공주택_특별법_시행규칙.md`에는 서식이 많아 분량이 큽니다. 검색 품질이 떨어지면 서식 부분을 덜어내세요.

## RAG 인덱싱용 코퍼스 (`corpus/`) ⚠️ AutoRAG는 이 폴더를 인덱싱합니다

- **이유:** Windows에서 AutoRAG(v2.15.0)가 **한글 파일명을 인덱싱하면 네이티브 크래시**(종료 코드 0xC0000409)가 납니다. 같은 파일을 영문 이름으로 바꾸면 정상 동작합니다(2026-11-26 확인). 그래서 원본(`notices/`, `laws/`)은 그대로 두고, 영문 이름 사본을 `corpus/`에 만듭니다.
- **매핑:** `corpus/corpus_map.json`에 영문 파일명 → 원본 파일명, 공고명, 유형, 지역, 마감일, 상세 URL이 들어 있습니다. 답변에 출처를 표시할 때 이 매핑으로 한글 공고명을 보여주면 됩니다.
- **법령 정리:**
  - 서식(신청서, 계약서 양식)은 자격 판단에 필요 없어서 뺐습니다.
  - 표 안의 공백 패딩을 줄였습니다. 공공주택 특별법 시행규칙은 37만 자에서 16만 자로 줄었습니다.
- **다시 만들 때:** `node scripts/build_corpus.mjs data`

## 공공데이터포털 API (인증키 동작 확인 2026-11-26)

인증키는 저장소 루트 `.env`의 `DATA_GO_KR_API_KEY`에 있습니다. `.gitignore`에 포함되어 있으니 저장소에 올리지 마세요.

| API | 엔드포인트 | 필수 파라미터 | 상태 |
|---|---|---|---|
| LH 분양임대공고문 조회 | `apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1` | `PG_SZ`, `PAGE` (+ `UPP_AIS_TP_CD`, `PAN_SS` 필터) | ✅ |
| LH 공고별 상세정보 | `apis.data.go.kr/B552555/lhLeaseNoticeDtlInfo1/getLeaseNoticeDtlInfo1` | `PAN_ID`, `CCR_CNNT_SYS_DS_CD`, `SPL_INF_TP_CD`, `UPP_AIS_TP_CD`, `AIS_TP_CD` | ✅ 일정·접수처 |
| LH 공고별 공급정보 | `apis.data.go.kr/B552555/lhLeaseNoticeSplInfo1/getLeaseNoticeSplInfo1` | 위와 같음 | ✅ 주택형·보증금·월임대료 |
| 마이홈 공공임대 모집공고 | `apis.data.go.kr/1613000/HWSPR02/rsdtRcritNtcList` | `pageNo`, `numOfRows` | ✅ 367건 (LH 외 기관 포함) |
| 마이홈 공공분양 모집공고 | `apis.data.go.kr/1613000/HWSPR02/ltRsdtRcritNtcList` | `pageNo`, `numOfRows` | ✅ 72건 |
| LH 건설임대 커트라인 | `apis.data.go.kr/B552555/lhCsrLsPwiPneScrInfo/getCsrLsPwiPneScrInfo` | `CNP_NM`(시도명) 등 검색조건 1개 이상, 기간 조회는 최대 1년 | ✅ 예: "2순위, 3점 당첨" |
| 마이홈 예비입주자 대기현황 | `apis.data.go.kr/1613000/HWSPR03/moveWaitStsList` | `brtcCode`(시도코드, 예: 11=서울) | ✅ 3,804건 |
| 청약홈 청약 신청·당첨자 통계 | `api.odcloud.kr/api/ApplyhomeStatSvc/v1/getAPTCmpetrtAreaStat` 외 5개 | `page`, `perPage` | ✅ |
| LH 공공임대주택 단지정보 | (엔드포인트 미확인) | | ⏳ |

응답 샘플은 `meta/api_test/`에 있습니다.
