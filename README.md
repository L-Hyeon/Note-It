# Plan‑It / Text‑Editor

Self‑Hosted Markdown Editor (Next.js App Router + OverType)

서버에 있는 마크다운 파일을 **리스트로 탐색 → 편집 → 저장**할 수 있는 셀프호스팅 에디터입니다.  
메인 페이지(`/`)는 비밀번호를 입력하는 로그인 게이트이며, 인증 후 리스트 페이지(`/list`)로 진입합니다.

---

## Features

- 로그인 게이트: `/`에서 비밀번호 입력 → 성공 시 세션 쿠키 발급 → `/list`로 이동
- 라우트 보호: `/list`, `/edit/**`, `/api/file/**`는 인증 쿠키 없으면 `/`로 리다이렉트
- 파일 리스트에서 클릭하면 편집 페이지(`/edit/...`)로 이동
- OverType 기반 편집기(툴바/프리뷰 모드 지원) + 앱 테마 연동
- 상단바 UX: `← Back` / 파일 경로 제목 / Save (dirty 상태 `*`)
- 저장 API: `PUT /api/file/[...path]`로 실제 파일에 write
- 라이트/다크 테마 토글(스위치 UI) + localStorage 저장
- CSS Variables 기반 컬러 시스템(라이트: `#6D5B7B`, 다크: `#E6D9FF`)
- 페이지 전환/리스트 애니메이션(Framer Motion)
- PWA(설치 가능): Web App Manifest + 아이콘 구성(서비스 워커 없이 “설치/아이콘/standalone” 중심)

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

- 스위치 형태 토글 UI
- localStorage에 테마 저장
- UI/버튼/입력/에디터에 동일한 변수 시스템 적용

---

## PWA (Installable)

- `app/manifest.ts`를 통해 Web App Manifest를 제공해 설치 가능하게 구성합니다.
- 아이콘은 `public/icons/*`에 두고 manifest의 `icons[].src`에서 `/icons/...` 경로로 참조합니다.
- 현재 구성은 서비스 워커 없이 “설치 경험”을 우선합니다(오프라인 편집/저장은 별도 설계 필요).

---

## Environment Variables

```env
APP_PASSWORD=your-strong-password
SESSION_SECRET=your-long-random-secret
FILES_ROOT=/absolute/path/to/markdown-root
```

- `APP_PASSWORD`: 로그인 비밀번호(하드코딩 금지)
- `SESSION_SECRET`: 세션 서명용 랜덤 시크릿(충분히 긴 랜덤 권장)
- `FILES_ROOT`: 서버에서 실제 파일이 존재하는 루트 디렉토리(미설정 시 `/files`)

---

## Security Notes (중요)

이 프로젝트는 서버의 실제 파일을 수정합니다. 외부 공개 시 최소한 아래를 고려해 주세요.

- 사설망 접근(방화벽/리버스프록시 ACL)
- 인증/권한 고도화(읽기/쓰기 분리)
- 파일 접근 범위 제한(루트 고정, 확장자 allowlist, 트래버설 차단)
- 감사 로그(누가/언제/무엇을 저장했는지)

---

## Roadmap (Nice‑to‑have)

- 로그아웃(`/api/auth/logout`) + Nav에 Logout 버튼
- Autosave + debounce
- 충돌 방지(ETag/mtime)
- 검색/필터/정렬/최근 수정
- 백업/스냅샷
- 권한/인증 고도화(사용자/권한 분리)
