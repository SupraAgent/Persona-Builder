# Dashboard Plan: File-Backed Document Manager

## Goal
Build a `/dashboard` page that lets users create, view, edit, and manage all project documents (personas, decisions, team manifests) — backed by actual markdown files on disk rather than just Supabase.

---

## Architecture

### Backend: File-System API Routes

New API routes under `src/app/api/docs/` that read/write markdown files directly:

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/docs` | GET | List all docs across `docs/`, `templates/`, `examples/` with parsed frontmatter |
| `/api/docs/[...path]` | GET, PUT, DELETE | Read/update/delete a specific markdown file by path |
| `/api/docs/create` | POST | Create a new doc from template (persona, decision, team) |
| `/api/docs/tree` | GET | Return folder tree structure for sidebar navigation |

**Key details:**
- Parse YAML frontmatter from every `.md` file using `gray-matter` (npm package)
- Extract `[[wikilinks]]` from file content to build link graph data
- Return both raw markdown and parsed metadata
- Write operations output valid markdown with YAML frontmatter
- Path-safe: restrict file operations to project directory only (no path traversal)

### Frontend: Dashboard Page + Components

**New route:** `/dashboard` → `src/app/dashboard/page.tsx`

**Layout (3-panel):**
```
┌──────────┬────────────────────┬──────────┐
│  Sidebar │   Main Editor      │  Links   │
│  (Tree)  │   (Create/Edit)    │  Panel   │
│          │                    │          │
│ docs/    │  YAML frontmatter  │ Backlinks│
│  personas│  editor (form)     │ Outgoing │
│  ref/    │                    │ Graph    │
│ templates│  Markdown body     │ preview  │
│ examples │  editor (textarea) │          │
└──────────┴────────────────────┴──────────┘
```

**Components to build:**

| Component | Location | Purpose |
|-----------|----------|---------|
| `dashboard-shell.tsx` | `components/dashboard/` | 3-panel layout wrapper |
| `file-tree.tsx` | `components/dashboard/` | Sidebar folder/file browser |
| `doc-editor.tsx` | `components/dashboard/` | Main content area: frontmatter form + markdown textarea |
| `frontmatter-editor.tsx` | `components/dashboard/` | YAML fields as form inputs (type, tags, phase, etc.) |
| `link-panel.tsx` | `components/dashboard/` | Show backlinks, outgoing links, mini graph |
| `template-picker.tsx` | `components/dashboard/` | Modal to create new doc from persona/decision/team template |
| `doc-preview.tsx` | `components/dashboard/` | Rendered markdown preview with clickable [[wikilinks]] |

### Document Creation Flow

1. User clicks "New Document" → template picker modal
2. Picks template type: **Persona**, **Decision**, **Team Manifest**, or **Blank**
3. Form pre-fills from the matching template in `templates/`
4. User fills in fields → frontmatter form + body editor
5. On save → POST `/api/docs/create` → writes `.md` file to correct directory
6. File tree refreshes, new doc appears

### Link Graph Integration

- The right panel parses `[[wikilinks]]` from the current doc
- Shows outgoing links (clickable → opens that doc in editor)
- Shows backlinks (which other docs link to this one) via the `/api/docs` index
- Small force-directed graph preview (optional, using d3-force or similar)

---

## Implementation Steps

### Step 1: Backend — File System API
1. Install `gray-matter` for frontmatter parsing
2. Create `src/lib/docs-api.ts` — core functions:
   - `listDocs(dir)` — recursively list `.md` files, parse frontmatter
   - `readDoc(path)` — read single file, return `{ frontmatter, content, links }`
   - `writeDoc(path, frontmatter, content)` — serialize and write
   - `deleteDoc(path)` — remove file
   - `getTree()` — folder tree structure
   - `extractWikilinks(content)` — regex parse `[[...]]` patterns
   - `findBacklinks(targetPath, allDocs)` — which docs link to target
3. Create API routes:
   - `src/app/api/docs/route.ts` (GET list)
   - `src/app/api/docs/[...path]/route.ts` (GET/PUT/DELETE single)
   - `src/app/api/docs/create/route.ts` (POST new from template)
   - `src/app/api/docs/tree/route.ts` (GET tree)

### Step 2: Frontend — Dashboard Shell + File Tree
1. Create `src/app/dashboard/page.tsx`
2. Build `dashboard-shell.tsx` (3-panel responsive layout)
3. Build `file-tree.tsx` (collapsible folders, file icons by type, click to open)
4. Add `/dashboard` to sidebar navigation

### Step 3: Frontend — Document Editor
1. Build `frontmatter-editor.tsx` — dynamic form from YAML fields
2. Build `doc-editor.tsx` — split view: frontmatter form + markdown textarea
3. Build `doc-preview.tsx` — rendered markdown with highlighted [[wikilinks]]
4. Add save/discard buttons, dirty state tracking

### Step 4: Frontend — Template Picker + Create Flow
1. Build `template-picker.tsx` — modal with template cards
2. Load templates from `/api/docs/[...path]` for `templates/` dir
3. Pre-fill editor with template content
4. Auto-generate filename from frontmatter (e.g., `role-company.md`)

### Step 5: Frontend — Link Panel
1. Build `link-panel.tsx` — tabs for Outgoing / Backlinks
2. Parse wikilinks client-side from current doc content
3. Fetch backlinks from API (search all docs for links to current)
4. Clickable links navigate within dashboard

### Step 6: Integration + Polish
1. Add dashboard link to app sidebar (`components/shell/sidebar.tsx`)
2. Wire up real-time file tree refresh after create/edit/delete
3. Add search/filter to file tree
4. Error handling for file conflicts, missing files
5. Mobile-responsive collapse of side panels

---

## Dependencies to Add

| Package | Purpose |
|---------|---------|
| `gray-matter` | Parse YAML frontmatter from markdown files |

No other new dependencies needed — existing stack (Next.js API routes, Tailwind, Framer Motion) covers everything.

---

## File Summary

**New files (~12):**
```
src/lib/docs-api.ts                          # Core file operations
src/app/api/docs/route.ts                    # GET list all docs
src/app/api/docs/create/route.ts             # POST create from template
src/app/api/docs/tree/route.ts               # GET folder tree
src/app/api/docs/[...path]/route.ts          # GET/PUT/DELETE single doc
src/app/dashboard/page.tsx                   # Dashboard page
src/components/dashboard/dashboard-shell.tsx # 3-panel layout
src/components/dashboard/file-tree.tsx       # Sidebar file browser
src/components/dashboard/doc-editor.tsx      # Main editor
src/components/dashboard/frontmatter-editor.tsx # YAML form
src/components/dashboard/link-panel.tsx      # Backlinks + outgoing
src/components/dashboard/template-picker.tsx # New doc from template
src/components/dashboard/doc-preview.tsx     # Markdown preview
```

**Modified files (~1):**
```
src/components/shell/sidebar.tsx             # Add dashboard nav link
```
