# Plan‑It / Text‑Editor

### Self‑Hosted File Markdown Editor (Next.js App Router + OverType)

[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](#)
[![Editor](https://img.shields.io/badge/Editor-OverType-7c3aed)](#)
[![API](https://img.shields.io/badge/API-Route%20Handlers-10b981)](#)
[![Deploy](https://img.shields.io/badge/Deploy-Docker-2496ed)](#)

서버 파일 시스템에 있는 문서를 **리스트로 탐색 → 클릭으로 편집 → 저장**할 수 있는 셀프호스팅 텍스트/마크다운 편집기입니다.  
Next.js App Router 기반으로 UI를 구성하고, 파일 읽기/쓰기는 Route Handler(API)에서 처리합니다.

---

## ✨ Features

- **파일 탐색**: 파일 리스트(List)에서 항목 클릭 시 편집 페이지(`/edit/...`)로 이동
- **실제 파일 편집**: 서버 디렉토리(`FILES_ROOT`)에 존재하는 파일을 읽고 저장
- **OverType 통합**: DOM-mounted 방식으로 에디터를 부착, 툴바 표시 가능
- **편집 상단바**: `← Back` / 제목(파일 경로) / `✓ Save`
- **저장 UX**: dirty 감지(변경 시 `*` 표시), 저장 중 비활성화/메시지 표시
- **로컬 폰트**: `public/fonts/*`로 self-hosted 폰트 로드(@font-face)
- **페이지 전환 애니메이션**: fade + blur (App Router `template.tsx`로 안정적 enter 전환)

---

## 🧭 Demo Flow

1. 메인 화면에서 파일 목록을 본다.
2. 파일을 클릭하면 `/edit/<filePath>`로 이동한다.
3. OverType 에디터로 내용을 편집한다.
4. `✓ Save`를 누르면 `/api/file/<filePath>`로 PUT 저장한다.

---

## 🧱 Directory Structure (Key Files)

```

src/
app/
layout.tsx
template.tsx                    \# 페이지 전환(enter) 애니메이션
page.tsx                        \# 메인(리스트) 페이지
edit/
[...path]/
page.tsx                    \# Server: 파일 읽어서 initialValue 전달
EditorClient.tsx            \# Client: OverType + 저장 버튼 + 헤더
page.module.css
api/
file/
[...path]/
route.ts                  \# GET/PUT: 읽기/저장 JSON API
components/
List.tsx                        \# Link로 /edit/... 이동
Editor.tsx                      \# OverType wrapper (init + value sync)
public/
fonts/
Atomy-Light.ttf
Atomy-Medium.ttf
Atomy-Bold.ttf

```

---

## 🧭 Routing

### 편집 페이지

- Route: `src/app/edit/[...path]/page.tsx`
- URL 예시: `/edit/docs/meeting/2026-02-06.md`
- params 예시:
  - `params.path = ["docs","meeting","2026-02-06.md"]`

### API

- Route: `src/app/api/file/[...path]/route.ts`
- URL 예시:
  - `GET /api/file/docs/a.md`
  - `PUT /api/file/docs/a.md`

---

## 💾 API Spec

### GET `/api/file/[...path]`

Response:

```json
{ "ok": true, "path": "docs/a.md", "content": "# hello" }
```

### PUT `/api/file/[...path]`

Request:

```http
PUT /api/file/docs/a.md
Content-Type: application/json

{ "content": "# hello\n" }
```

Response:

```json
{ "ok": true, "path": "docs/a.md" }
```

---

## 🔐 FILES_ROOT (Environment Variable)

서버에서 “실제 파일”이 존재하는 루트 디렉토리입니다.

- 설정값이 있으면: `process.env.FILES_ROOT`
- 없으면 기본값: `/files`

### Local dev (`.env.local`)

```env
FILES_ROOT=/absolute/path/to/markdown-root
```

### Docker example

```yaml
services:
  app:
    environment:
      - FILES_ROOT=/files
    volumes:
      - /host/md:/files
```

---

## 🎨 Fonts (Self‑Hosted)

`public/fonts`에 폰트를 넣고 `@font-face`로 로드합니다.

권장 가중치:

- Light: 300
- Medium: 500
- Bold: 700

권장 적용 방식:

- reset selector 전체에 `font-family`를 “강제”하기보다,
- `html, body`에만 `font-family` + 기본 `font-weight`를 주고 상속시키는 방식이 안전합니다.

---

## 🎬 Page Transition (Fade + Blur)

App Router에서 `AnimatePresence`를 전역으로 돌리면 이중 전환/멈춤 같은 이슈가 생길 수 있어, `src/app/template.tsx` 기반으로 **enter 애니메이션**을 적용하는 구성을 사용합니다.

컨셉:

- initial: `opacity 0 + blur + y`
- animate: `opacity 1 + blur 0 + y 0`

---

## 🧰 Editor UX (Top Bar)

상단바 구성:

- Left: `← Back`
- Center: 파일 경로(제목), dirty면 `*`
- Right: `✓ Save` (dirty일 때만 활성화)

추가 아이디어:

- 저장 성공 시 버튼 라벨을 잠깐 `✓ Saved`로 변경
- `Ctrl/Cmd + S` 단축키 저장
- 페이지 이탈 시 dirty 경고(confirm)

---

## 🧩 Troubleshooting

### 1) Hydration mismatch (날짜/로케일)

서버/클라이언트에서 `toLocaleString()` 같은 로케일 의존 문자열을 그대로 렌더하면 mismatch가 날 수 있습니다.
해결: 서버에서 문자열로 포맷해서 내려주거나, 클라이언트 hydration 이후에만 렌더링하세요.

### 2) 폰트가 모바일에서만 안 먹음

- `@font-face`의 `font-weight`가 실제 폰트 파일과 맞는지 확인
- reset에서 `font: inherit`가 `font-family`를 덮어쓰는지 확인
- 가능하면 `woff2`도 같이 제공(성능/호환 개선)

### 3) OverType 툴바 드롭다운이 잘림

에디터 호스트에 `overflow: hidden`이 있으면 메뉴가 잘릴 수 있습니다.
해결: 필요한 경우 `overflow: visible`로 조정하거나, 툴바 영역과 편집 영역을 분리하세요.

---

## 🔒 Security Notes (중요)

이 프로젝트는 서버의 실제 파일을 수정합니다.
외부에 공개하려면 최소한 아래를 고려하세요.

- 사설망에서만 접근(방화벽/리버스프록시 ACL)
- 토큰 기반 인증 헤더(쓰기 권한 분리)
- 파일 접근 범위 제한(허용 확장자, 루트 고정, 트래버설 차단)
- 감사 로그(누가 언제 어떤 파일을 저장했는지)

---

## 🗺 Roadmap (Nice-to-have)

- [ ] Autosave + debounce
- [ ] 충돌 방지(ETag/mtime)
- [ ] 다운로드(현재 편집 파일, README 등)
- [ ] 파일 검색/필터/정렬/최근 수정
- [ ] Toolbar 커스터마이징(heading/italic 제거 등)
- [ ] 권한/인증(읽기/쓰기)
