# 집사서 (jipsaseo)

**내 조건으로 읽어 주는 청약·공공임대 공고 자격 매칭**

LH 등 공공주택 모집공고문은 수십 쪽짜리 PDF/HWP이고, 공급 유형마다 소득·자산 기준, 무주택 요건, 거주 지역, 우선순위가 다릅니다. 집사서는 사용자의 조건(나이, 가구 형태, 소득, 무주택 기간 등)을 바탕으로 지원 가능한 공고와 공급 유형, 예상 순위, 필요 서류를 안내하고, 판단 근거가 되는 **공고문·법령 조항을 인용**합니다.

- 검색·인용: [AutoRAG Agent](https://github.com/Marker-Inc-Korea/AutoRAG) (PDF/HWP 파싱, 로컬 임베딩 하이브리드 검색)
- 데이터: 공공데이터포털 LH·마이홈·청약홈 API, LH 모집공고문, 국가법령정보 (주택공급규칙, 공공주택특별법 시행규칙 등)

> 이 저장소에는 현재 RAG용 데이터와 데이터 수집·변환 스크립트가 있습니다.

## 구성

| 경로 | 내용 |
|---|---|
| `data/README.md` | 데이터 상세 설명 (출처, API 엔드포인트, 한계) |
| `data/notices/` | LH 모집공고문 PDF 원본 16건 (한글 파일명) |
| `data/laws/` | 법령·지침 원문 Markdown 4건 |
| `data/corpus/` | **AutoRAG 인덱싱용 코퍼스** (영문 파일명 사본 + 정리된 법령) |
| `data/corpus/corpus_map.json` | 영문 파일명 → 한글 공고명, 유형, 지역, 마감일, 상세 URL |
| `data/meta/` | LH 공고 목록 JSON (87건), 다운로드 manifest, 법령 원본 JSON, API 응답 샘플 |
| `scripts/` | 데이터 수집·변환 스크립트 (Node.js 24) |
| `docs/AUTORAG_GETTING_STARTED.md` | AutoRAG 설치·사용 가이드 |

## 다른 PC에서 임베딩하기

로컬 CPU 임베딩(Qwen3-Embedding-0.6B)은 이 코퍼스(약 123만 자, 청크 약 700개) 기준으로 30분 넘게 걸리고, CPU와 메모리(약 2GB)를 많이 씁니다.

### 1. 준비
- Node.js 24 이상, Git, (선택) Bun
- AutoRAG 소스 빌드:
  ```bash
  git clone https://github.com/Marker-Inc-Korea/AutoRAG.git
  cd AutoRAG && bun install --frozen-lockfile   # 또는 npm install
  ```
  npm 패키지로 설치해도 됩니다: `npm install -g @autorag/librarian`

### 2. 인덱싱 (반드시 `data/corpus/`를 대상으로)

PowerShell 예시. `<REPO>`는 이 저장소 경로, `<AUTORAG>`는 AutoRAG 경로입니다.

```powershell
$REPO = "<REPO>"; $CLI = "<AUTORAG>\dist\cli\index.js"   # 전역 설치했다면 node $CLI 대신 autorag
$env:AUTORAG_HOME = "$REPO\.autorag-home"; $env:AUTORAG_CONFIG = "$env:AUTORAG_HOME\config.json"
New-Item -ItemType Directory -Force $env:AUTORAG_HOME, "$REPO\workspace" | Out-Null
Set-Location "$REPO\workspace"
node $CLI lite init --search-paths "$REPO\data\corpus\notices,$REPO\data\corpus\laws" --workspace "$REPO\workspace"
node $CLI refresh --json      # 오래 걸림. 터미널을 닫지 말 것
node $CLI status --json       # state가 fresh인지 확인
node $CLI lite retrieve "행복주택 청년 소득 기준" --top-k 5 --json
```

macOS/Linux에서는 경로 구분자만 `/`로 바꾸면 됩니다.

> ⚠️ **Windows에서는 한글 파일명을 인덱싱하면 AutoRAG(v2.15.0)가 크래시**합니다(종료 코드 0xC0000409). 그래서 `data/notices/`가 아니라 영문 파일명 사본인 `data/corpus/`를 인덱싱해야 합니다.

### 3. 결과물 가져오기

임베딩 결과는 `workspace/.autorag/` 아래에 생깁니다. **`workspace/.autorag` 폴더 전체**를 원래 PC의 같은 위치(`<REPO>/workspace/.autorag`)로 복사하세요.

- 핵심은 `workspace/.autorag/minsync/.minsync/store/`(LanceDB 벡터 저장소)와 `manifest.json`입니다. `parsed/`(파싱 결과)도 같이 가져오면 다시 파싱하지 않습니다.
- `workspace/`와 `.autorag-home/`은 `.gitignore`에 들어 있습니다. USB나 클라우드 드라이브로 옮기거나, 압축해서 옮기세요.
- 가져온 뒤 원래 PC에서 `lite init`(경로만 이 PC 기준으로)을 실행하고 `status`를 확인합니다. 파일 내용 해시가 같으면 다시 임베딩하지 않을 것으로 예상하지만, **아직 확인하지 않았습니다**. 가져온 뒤 첫 `refresh`에서 확인이 필요합니다.

## 데이터 다시 수집하기

```bash
# 1) LH 공고 목록 (키 불필요, k-skill 프록시)
curl -G https://k-skill-proxy.nomadamas.org/v1/lh-notice/search --data-urlencode category=06 --data-urlencode status=접수중 > data/meta/lh_06.json
# (스크립트는 data/meta/lh_notices_all.json을 입력으로 받음. 합치는 방법은 data/README.md 참고)
# 2) 공고문 PDF 다운로드
node scripts/collect_lh.mjs data/meta data/notices
# 3) 법령 JSON → Markdown
node scripts/law_to_md.mjs data/meta/law_supply_rule.json data/laws/주택공급에_관한_규칙.md "제목" "출처URL"
# 4) 인덱싱용 코퍼스 생성 (영문 파일명, 서식 제거, 공백 정리)
node scripts/build_corpus.mjs data
# 5) 공공데이터포털 API 점검 (.env에 DATA_GO_KR_API_KEY 필요)
node scripts/test_apis.mjs .env data/meta/api_test
```

## 비밀정보
- 공공데이터포털 인증키는 `.env`(`DATA_GO_KR_API_KEY=...`)에만 둡니다. `.env`는 커밋하지 않습니다.
