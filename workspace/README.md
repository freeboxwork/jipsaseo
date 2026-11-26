# 미리 만든 RAG 인덱스 (`rag-index` 브랜치 전용)

`data/corpus/` 20개 파일(공고문 PDF 16건, 법령 4건)을 AutoRAG 2.15.0으로 인덱싱한 결과입니다. 2026-11-26에 Windows PC에서 만들었고, CPU 임베딩에 58분이 걸렸습니다.

| 경로 | 내용 |
|---|---|
| `.autorag/minsync/.minsync/store/` | LanceDB 벡터 저장소 (Qwen3-Embedding-0.6B, 1,024차원) |
| `.autorag/minsync/files/` | 인덱싱에 쓰인 파싱 결과 |
| `.autorag/parsed/` | 공고문·법령 파싱 결과 (Markdown, 쪽 정보) |

실행 파일(`.autorag/bin/`)과 PC별 파일(`.autorag/everything/`, 잠금 파일, `.autorag-home/`)은 넣지 않았습니다. 첫 `refresh` 때 각 PC에서 다시 만들어집니다.

## 받는 방법

브랜치를 바꾸지 않고 `workspace/` 폴더만 꺼냅니다. `main`에서는 이 폴더가 `.gitignore`에 들어 있어 커밋에 섞이지 않습니다.

```bash
git fetch origin rag-index
git restore --source origin/rag-index -- workspace
```

그다음 저장소 README의 "인덱싱" 절차대로 `lite init`(경로는 자기 PC 기준)과 `refresh`를 실행합니다.

## 확인한 것

같은 PC에서 이 브랜치를 다른 드라이브·경로에 복제해 `lite init`과 `refresh`를 실행했습니다(2026-11-26). 22초 만에 끝났고 재임베딩은 없었습니다(MinSync 동기화 0건). 파싱만 다시 했고, 검색 결과와 점수도 원본과 같았습니다. 다른 PC나 다른 운영체제에서는 아직 확인하지 않았습니다.

## 주의

- `rag-index` 브랜치로 전환(`git switch`)하지 마세요. 다른 브랜치로 돌아갈 때 git이 `workspace/`의 인덱스 파일을 지웁니다.
- Windows에서 첫 `refresh`는 Git Bash가 아니라 PowerShell에서 실행하세요. Git Bash에서는 MinSync 설치가 실패합니다.
- Jikji는 Rust(cargo)가 없으면 자동 설치되지 않습니다. 경고만 나고 검색은 동작합니다.
- 코퍼스(`data/corpus/`)를 다시 만들면 이 인덱스는 낡은 것이 됩니다. 다시 인덱싱한 뒤 이 브랜치도 새로 올려야 합니다.
