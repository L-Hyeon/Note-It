<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# 방금 생성한 로그인 페이지까지 반영해서 Readme 다시 만들어줘

````md
# Plan‑It / Text‑Editor

Self‑Hosted Markdown Editor (Next.js App Router + OverType)

서버에 있는 마크다운 파일을 **리스트로 탐색 → 편집 → 저장**할 수 있는 셀프호스팅 에디터입니다.  
메인 페이지(`/`)는 비밀번호를 입력하는 로그인 게이트이며, 인증 후에 리스트 페이지(`/list`)로 진입합니다.

---

## Features

- 로그인 게이트: `/`에서 비밀번호 입력 → 성공 시 쿠키 세션 발급 → `/list`로 이동
- 라우트 보호: `/list`, `/edit/**`, `/api/file/**`는 인증 쿠키 없으면 `/`로 리다이렉트
- 파일 리스트에서 클릭하면 편집 페이지(`/edit/...`)로 이동
- OverType 기반 편집기(툴바/프리뷰 모드 지원) + 테마 적용
- 상단바 UX: `← Back` / 파일 경로 제목 / `Save` (dirty 상태 표시 `*`)
- 저장 API: `PUT /api/file/[...path]`로 실제 파일에 write
- 라이트/다크 테마 토글(스위치 UI) + localStorage에 사용자 선택 저장
- 앱 전역 테마 변수(CSS variables) 기반 스타일 통일
- 페이지 전환 애니메이션(fade + blur, App Router `template.tsx`)

---

## Pages & Routes

### Pages

- `/` : 로그인(비밀번호 입력)
- `/list` : 파일 리스트
- `/edit/[...path]` : 편집 화면(마크다운만 허용)

### API

- `POST /api/auth/login` : 비밀번호 검증 후 세션 쿠키 설정
- `GET /api/file/[...path]` : 파일 읽기
- `PUT /api/file/[...path]` : 파일 저장

---

## API Examples

### GET `/api/file/[...path]`

```json
{ "ok": true, "path": "docs/a.md", "content": "# hello" }
```
````

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

## Theme System

앱은 `html[data-theme="light" | "dark"]`를 기준으로 전역 CSS 변수를 전환합니다.

- Light: near‑white 배경 + 포인트 `#6D5B7B`
- Dark: near‑black 배경 + 포인트 `#E6D9FF`

ThemeChanger:

- 스위치 형태의 토글 UI
- `localStorage`에 테마 저장
- 전역 CSS 변수 기반으로 페이지/버튼/입력/에디터 톤 통일

---

## Environment Variables

로그인 게이트 및 세션 서명에 사용합니다.

```env
APP_PASSWORD=your-strong-password
SESSION_SECRET=your-long-random-secret
```

권장: `SESSION_SECRET`은 충분히 긴 랜덤 값(예: `openssl rand -hex 32` 결과)을 사용하세요.

---

## Security Notes (중요)

이 프로젝트는 서버의 실제 파일을 수정합니다. 외부 공개 시 최소한 아래를 고려해 주세요.

- 사설망에서만 접근(방화벽/리버스프록시 ACL)
- 토큰/계정 기반 인증으로 고도화(읽기/쓰기 권한 분리)
- 파일 접근 범위 제한(루트 고정, 확장자 allowlist, 트래버설 차단)
- 감사 로그(누가/언제/무엇을 저장했는지)

---

## Roadmap (Nice‑to‑have)

- 로그아웃(`/api/auth/logout`) + Nav에 Logout 버튼
- Autosave + debounce
- 충돌 방지(ETag/mtime)
- 파일 검색/필터/정렬/최근 수정
- 파일 생성/삭제
- 백업/스냅샷
