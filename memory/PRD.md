# Jataí Região Trabalho — PRD

## Original problem statement
Clone of a services marketplace UI. User reported a series of UI/UX & functional issues across sessions:
- Profile photo click redirecting to wrong profile
- Geolocation-based login/signup (Nominatim)
- Admin-only Dashboard access (email `francesdefranceff@gmail.com`)
- Rebranding to "Jataí Região Trabalho" (pink → orange, hero, logo)
- Mobile responsiveness (no zoom blur, padding)
- Render deployment configuration
- **Critical:** posts with photos/videos disappear from the feed after publish/reload

User language: **Portuguese**

## Architecture
- Frontend: React + Tailwind + Shadcn UI. State persisted in `localStorage` (mock data layer).
- Backend: FastAPI (minimal usage; posts/users are currently frontend-only).
- Mongo: not yet used for posts.
- Deploy target: Render (`render.yaml` present).

## Key files
- `/app/frontend/src/pages/Feed.jsx` — feed list + desktop publisher + public modal
- `/app/frontend/src/pages/PublicarDemanda.jsx` — mobile publisher (from BottomNav `+`)
- `/app/frontend/src/components/BottomNav.jsx` — mobile nav
- `/app/frontend/src/pages/Login.jsx` — geolocation login (Nominatim)
- `/app/frontend/src/pages/Perfil.jsx`, `Mensagens.jsx` — profile routing by `userId`
- `/app/frontend/src/utils/mediaUtils.js` — image compression + safe localStorage (NEW)
- `/app/render.yaml` — Render deploy config

## Changelog
### 2026-02 — Media persistence fix (current session)
- **Root cause of disappearing posts:** `PublicarDemanda.jsx` was saving `URL.createObjectURL(file)` blob URLs to `localStorage`. Blob URLs become invalid on reload → media "disappears". `Feed.jsx` already used base64 but had no quota protection.
- Created `/app/frontend/src/utils/mediaUtils.js`:
  - `compressImage(file)` → canvas resize (max 1024px) + JPEG quality 0.7 → base64
  - `videoToBase64(file)` → base64 with 10 MB cap
  - `processMediaFile(file)` → dispatches image/video
  - `safeSetLocalStorage(key, value)` → try/catch with quota-aware messages
- Refactored `Feed.jsx`:
  - `handlePhotoSelect` now async + supports image + video, compresses images
  - `handlePostSubmit` + `handlePublicPostSubmit` save typed `media: [{type, dataUrl}]` and use `safeSetLocalStorage`
  - `PostCard` renders both images and `<video controls>`, with backward compat for old `post.photos` array of strings
  - File inputs now `accept="image/*,video/*"`
  - Added `data-testid` to publish buttons & upload slots
- Refactored `PublicarDemanda.jsx` (mobile path):
  - Replaced blob URLs with compressed base64 via `processMediaFile`
  - Added video support and quota-safe save
  - `userId` set from `user.email` (parity with Feed publisher) — fixes profile redirect for own posts
  - Previews now show `<video>` for video files

### Earlier in this session (carried over from handoff)
- Profile redirection bug fixed (Perfil, Feed, Mensagens use `userId`)
- "Gerenciar meu perímetro" added in Assinatura
- "Responder" in feed → opens chat with post owner
- Geolocation login via Nominatim with fallback/timeout
- Logout button in Perfil
- Dashboard restricted to admin email
- Removed Emergent logo from `index.html`
- Rebranding (orange palette, "Jataí Região Trabalho", new hero)
- Category filter modal in Ofertantes
- Mobile zoom blur fix (viewport + touch-action)
- `date-fns` 4.x → 3.x
- User registration saves name + assigns default avatar

## Backlog
### P0 — verify in production
- User to test post publishing on preview + Render (images & video, reload check). Self-test requested.

### P1
- Verify Render deploy end-to-end (env vars, build).
- Migrate posts/users from `localStorage` to backend MongoDB. Removes the 5–10MB per-browser cap and makes posts visible across devices. This is the proper long-term fix.

### P2
- Refactor large `Feed.jsx` into smaller components (PostCard, Composer, PublicModal).
- Add pagination / cleanup for old user posts when quota gets tight.
- Real auth (current admin check is string-match on email).
- Stricter media validation (server-side once backend handles posts).

## Test credentials
See `/app/memory/test_credentials.md`. Admin: `francesdefranceff@gmail.com`.

## Mocked / not real
- Posts, profiles, messages, auth — all in `localStorage`.
- No backend persistence for user posts yet.
