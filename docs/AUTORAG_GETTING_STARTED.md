# AutoRAG 로컬 설치 & 시작 가이드

> 설치 위치: `C:\WORK\AUTO_RAG\AutoRAG` (commit `42368a32`, 2026-11-25)
> 설치일: 2026-11-26

## 0. 먼저 알아둘 점: 저장소 안에 프로젝트가 두 개 있습니다

| | **AutoRAG 2.0 (Agent)** | **Legacy AutoRAG (RAG AutoML)** |
|---|---|---|
| 위치 | 저장소 루트 (`src/`) | `legacy/` |
| 하는 일 | 내 PC의 파일·메신저·메일 등을 검색하고 **출처를 달아 답하는 개인 사서 에이전트** | 내 QA 데이터로 여러 RAG 구성을 **자동 평가해 최적의 파이프라인을 찾는 도구** |
| 기술 스택 | TypeScript, Node 24, Bun | Python 3.10–3.12, uv |
| 상태 | 현재 메인 개발 대상 | 유지보수 모드 (버그 수정과 PyPI 릴리스는 계속됨) |
| 실행 파일 | `node dist\cli\index.js` | `legacy\.venv\Scripts\autorag.exe` |

두 CLI의 이름이 모두 `autorag`라서 헷갈리기 쉽습니다. 아래에서는 경로를 붙여서 구분합니다.

---

## 1. 지금까지 설치한 것

| 항목 | 상태 |
|---|---|
| Git clone | ✅ `C:\WORK\AUTO_RAG\AutoRAG` |
| Bun 1.4.5 | ✅ `npm install -g bun`으로 설치 (`%APPDATA%\npm\bun.cmd`) |
| 2.0 의존성과 빌드 | ✅ `bun install --frozen-lockfile` → `dist/` 생성, `--version` = 2.15.0 |
| Legacy venv | ✅ `legacy\.venv` (Python 3.12.12, `uv sync`, 기본 의존성만 설치) |
| Legacy import와 CLI | ✅ `import autorag` 성공, `autorag --help` 정상 출력 |

### 실행할 때 나오는 경고 (무시해도 됩니다)
- 2.0: `ExperimentalWarning: SQLite is an experimental feature` → Node 24의 내장 SQLite 경고입니다.
- Legacy: `PyTorch was not found`, `You are using API version`, 종료할 때 나오는 `No module named 'torch'` → GPU extra를 설치하지 않았기 때문에 나옵니다. OpenAI 같은 **API 모델만 쓰면 문제없습니다**.

---

## 2. AutoRAG 2.0 시작하기

### 2-1. 터미널 준비 (새 PowerShell을 열 때마다)

```powershell
cd C:\WORK\AUTO_RAG\AutoRAG
$env:Path = "$env:APPDATA\npm;$env:Path"   # 새 터미널에서 bun이 안 잡힐 때만
function ar { node C:\WORK\AUTO_RAG\AutoRAG\dist\cli\index.js @args }
ar --help
```

> `autorag` 명령을 전역으로 쓰고 싶다면 저장소에서 `bun link`를 실행하세요. 다만 legacy venv를 활성화한 상태에서는 이름이 겹칩니다.

### 2-2. 모델 없이 먼저 써 보기 (Lite 모드, 추천)

LLM 키 없이 인덱싱과 검색만 해 봅니다. 실제 `~/.autorag`를 건드리지 않도록 **임시 홈**에서 실행합니다.

```powershell
$QA = "C:\WORK\AUTO_RAG\playground"
$env:AUTORAG_HOME   = "$QA\.autorag-home"
$env:AUTORAG_CONFIG = "$env:AUTORAG_HOME\config.json"
New-Item -ItemType Directory -Force "$env:AUTORAG_HOME","$QA\workspace","$QA\docs" | Out-Null
"# 환불 정책`n`n환불 예외는 지급 전에 이사 승인이 필요하다." | Out-File -Encoding utf8 "$QA\docs\refund-policy.md"

ar lite init --search-paths "$QA\docs" --workspace "$QA\workspace"
ar refresh --json          # 첫 실행 때 MinSync와 임베딩 모델(Qwen3-Embedding-0.6B)을 자동으로 받습니다
ar status --json
ar lite retrieve "환불 예외에는 무엇이 필요한가" --top-k 5 --json
```

- 처음 `refresh`를 실행하면 MinSync 바이너리와 로컬 임베딩 모델을 내려받기 때문에 시간이 걸립니다. 파일 내용은 외부로 전송되지 않습니다.
- 실제 문서 폴더를 쓰려면 `--search-paths "D:\문서,D:\노트"`처럼 바꾸면 됩니다.

### 2-3. LLM을 붙여 답변까지 받기

```powershell
ar init --search-paths "$QA\docs" --workspace "$QA\workspace" --force
ar tui                     # TUI 안에서 /login → /model 로 공급자와 모델을 고릅니다
ar health --json           # 모델 연결 확인
ar search "환불 예외 조건이 뭐야?" --top-k 5 --json
```

- 사용할 수 있는 모델 목록은 `ar models list --available`로 확인합니다.
- API 키는 설정 파일이 아니라 OS의 암호화 저장소에 보관됩니다.

### 2-4. Claude Code 같은 에이전트에서 검색 도구로 쓰기 (MCP)

`dist\mcp\index.js`(`autorag-mcp`)를 stdio MCP 서버로 등록하고, 같은 `AUTORAG_CONFIG` 경로를 지정하면 됩니다.
→ `docs/agents/mcp-server.md` 참고

### 2-5. 개발할 때 쓰는 명령

```powershell
bun run build        # dist 다시 빌드 (src를 수정한 뒤)
bun run typecheck
bun run lint
bun run test         # 전체 테스트 (오래 걸립니다)
```

### 2-6. 읽어볼 문서
- `docs/guide/quickstart.md`: 전체 흐름
- `docs/reference/cli.md`: CLI 명령 전체
- `docs/datasources/overview.md`: 카카오톡, Slack, Gmail, Obsidian 등 데이터 소스 연결
- `docs/contributing/architecture.md`: 내부 구조

---

## 3. Legacy AutoRAG (RAG AutoML) 시작하기

### 3-1. 터미널 준비

```powershell
cd C:\WORK\AUTO_RAG\AutoRAG\legacy
.\.venv\Scripts\Activate.ps1
$env:OPENAI_API_KEY = "sk-..."      # 샘플 설정은 OpenAI 임베딩과 LLM을 사용합니다
```

### 3-2. 전체 흐름

```
원본 문서 → (Parse) → (Chunk) → corpus.parquet
                               → (QA 생성)  → qa.parquet
corpus + qa + config.yaml → autorag evaluate → 최적 파이프라인 → 배포(API/Web)
```

### 3-3. 샘플 데이터로 바로 평가해 보기 (ELI5)

```powershell
mkdir data\eli5 -Force
python .\sample_dataset\eli5\load_eli5_dataset.py --save_path .\data\eli5
#  → corpus.parquet, qa_train.parquet, qa_test.parquet 생성 (HuggingFace에서 다운로드)

autorag evaluate `
  --config .\sample_config\rag\english\non_gpu\simple_openai.yaml `
  --qa_data_path .\data\eli5\qa_test.parquet `
  --corpus_data_path .\data\eli5\corpus.parquet `
  --project_dir .\projects\eli5
```

- `sample_config\rag\english\non_gpu\`에 있는 설정 중 `simple_*`이 가장 가볍습니다. `compact`과 `full`은 OpenAI 호출이 많아서 **비용이 커집니다**.
- 한국어 데이터는 `sample_config\rag\korean\`과 `uv sync --extra ko`(kiwi 토크나이저)를 사용하세요.

### 3-4. 결과 확인과 배포

```powershell
autorag dashboard --trial_dir .\projects\eli5\0          # 결과 대시보드
autorag extract_best_config --trial_path .\projects\eli5\0 --output_path best.yaml
autorag run_web --trial_path .\projects\eli5\0           # Gradio 또는 Streamlit 데모
autorag run_api --trial_dir .\projects\eli5\0 --port 8000
```

### 3-5. 내 문서로 할 때
README의 *Data Creation* 섹션 순서를 따릅니다.
1. `autorag.parser.Parser`와 `sample_config\parse\*.yaml`로 PDF 등 문서를 파싱합니다.
2. `autorag.chunker.Chunker`와 `sample_config\chunk\*.yaml`로 청킹해서 corpus.parquet을 만듭니다.
3. LLM으로 QA를 생성해서 qa.parquet을 만듭니다.
4. 위의 `autorag evaluate`를 실행합니다.

### 3-6. 옵션 설치
```powershell
uv sync --extra ko        # 한국어 토크나이저
uv sync --extra parse     # PDF 파서
uv sync --extra gpu       # 로컬 모델 (torch, 수 GB, CUDA 권장)
```

---

## 4. 어디서부터 시작할까?
- **"내 문서를 AI로 찾고 싶다"** → 2.0의 **2-2 Lite 모드**부터 해 보세요 (키 필요 없음).
- **"RAG 시스템을 만들고 어떤 구성이 가장 좋은지 실험하고 싶다"** → Legacy의 **3-3 ELI5 샘플**부터 해 보세요 (OpenAI 키 필요).
