# JOLT Web — Complete Project Structure

```
NOTES_APP/
│
├── 📱 app/                          # Next.js App Router
│   ├── api/                         # API Routes (Server-side)
│   │   ├── notes/
│   │   │   ├── route.ts            # GET all notes, POST create
│   │   │   └── [id]/route.ts       # GET, PATCH, DELETE by ID
│   │   ├── categories/
│   │   │   └── route.ts            # Category CRUD
│   │   └── tags/
│   │       └── route.ts            # Tag fetching
│   │
│   ├── globals.css                  # Design system & animations
│   ├── layout.tsx                   # Root layout wrapper
│   └── page.tsx                     # Main notes interface (client)
│
├── 🗄️  lib/
│   └── db.ts                        # SQLite database service
│
├── 📝 types/
│   └── index.ts                     # TypeScript interfaces
│
├── 📚 Documentation
│   ├── README.md                    # Quick start guide
│   ├── WEB_IMPLEMENTATION.md        # Implementation details
│   ├── DESIGN_GUIDE.md              # Visual design system
│   └── PRD.md                       # Original product requirements
│
├── ⚙️  Configuration
│   ├── package.json                 # Dependencies & scripts
│   ├── tsconfig.json                # TypeScript config
│   ├── next.config.js               # Next.js config
│   └── .gitignore                   # Git ignore rules
│
└── 🚀 Scripts
    └── start.sh                     # Quick start script

```

## File Breakdown

### Core Application Files

| File | Lines | Purpose |
|------|-------|---------|
| `app/page.tsx` | 600+ | Main UI: notes grid, modals, state management |
| `lib/db.ts` | 200+ | SQLite database service with full CRUD |
| `app/globals.css` | 150+ | Design system, animations, utilities |
| `app/api/notes/route.ts` | 30 | GET all notes, POST create note |
| `app/api/notes/[id]/route.ts` | 50 | GET/PATCH/DELETE single note |
| `types/index.ts` | 25 | TypeScript interfaces |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Setup instructions, tech stack, API docs |
| `WEB_IMPLEMENTATION.md` | Feature checklist, architecture overview |
| `DESIGN_GUIDE.md` | Complete visual design system |
| `PRD.md` | Original Flutter PRD (reference) |

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | npm dependencies & scripts |
| `tsconfig.json` | TypeScript compiler options |
| `next.config.js` | Next.js configuration |
| `.gitignore` | Files to exclude from git |

## Component Hierarchy

```
Home (page.tsx)
├── Header
│   ├── Title Section
│   │   ├── "JOLT" (display title)
│   │   └── "Editorial Notes" (subtitle)
│   └── Search Bar
├── Controls
│   └── "+ New Note" Button
├── Notes Grid
│   └── Note Card (multiple)
│       ├── Note Header
│       │   ├── Title
│       │   └── Pin Button
│       ├── Content Preview
│       ├── Tags (if any)
│       └── Meta Info
└── Note Modal (conditional)
    ├── Modal Header
    │   ├── Title
    │   └── Close Button
    └── Form
        ├── Title Input
        ├── Content Textarea
        ├── Tags Input
        ├── Favorite Checkbox
        └── Action Buttons
            ├── Delete (if editing)
            ├── Cancel
            └── Save/Update
```

## API Route Flow

```
Client Request
     ↓
Next.js API Route (/app/api/*)
     ↓
Database Service (lib/db.ts)
     ↓
SQLite Database (jolt.db)
     ↓
Response (JSON)
     ↓
Client State Update
     ↓
UI Re-render
```

## Data Flow

```
User Action
     ↓
Event Handler (onClick, onChange)
     ↓
API Fetch (fetch('/api/notes'))
     ↓
Server-side Handler
     ↓
DatabaseService Method
     ↓
SQLite Query
     ↓
Response
     ↓
State Update (setState)
     ↓
React Re-render
     ↓
Framer Motion Animation
     ↓
UI Update
```

## Key Features Map

```
Feature                   → Implementation
─────────────────────────────────────────────────────
Create Note              → POST /api/notes
Edit Note                → PATCH /api/notes/[id]
Delete Note              → DELETE /api/notes/[id]
Search Notes             → GET /api/notes?q=query
Pin Note                 → PATCH with isPinned toggle
Favorite Note            → PATCH with isFavorite toggle
Tag Management           → Auto-create on note save
Real-time Search         → debounced onChange handler
Animations               → Framer Motion + CSS
Responsive Design        → CSS media queries
Type Safety              → TypeScript throughout
```

## Database Schema Relationships

```
Notes Table
    ├── id (PK)
    ├── title
    ├── content
    ├── createdAt
    ├── updatedAt
    ├── isPinned
    ├── isFavorite
    └── categoryId (FK) ───→ Categories Table
                                ├── id (PK)
                                ├── name
                                ├── color
                                └── createdAt

    ↓ (many-to-many)

NoteTags Junction Table
    ├── noteId (FK)
    └── tagId (FK) ───────→ Tags Table
                                ├── id (PK)
                                ├── name
                                └── createdAt
```

## Technology Stack Visualization

```
Frontend Layer
├── React 18
├── Next.js 14 (App Router)
├── TypeScript
├── Framer Motion
└── CSS-in-JSX

API Layer
├── Next.js API Routes
└── REST endpoints

Data Layer
├── better-sqlite3
└── SQLite database

Utilities
└── date-fns (formatting)
```

## Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Access app
http://localhost:3000

# 4. Edit files
# → Auto-reloads on save

# 5. Build for production
npm run build

# 6. Start production server
npm start
```

## File Size Estimates

```
📦 Total Project Size
├── node_modules/        ~200 MB (after npm install)
├── Source code          ~50 KB
├── Documentation        ~30 KB
├── Database (empty)     ~20 KB
└── Config files         ~5 KB
```

## Runtime Dependencies

```json
{
  "next": "^14.0.4",              // React framework
  "react": "^18.2.0",             // UI library
  "react-dom": "^18.2.0",         // DOM rendering
  "better-sqlite3": "^9.2.2",     // SQLite driver
  "framer-motion": "^10.16.16",   // Animations
  "date-fns": "^3.0.6"            // Date utilities
}
```

## Dev Dependencies

```json
{
  "@types/node": "^20.10.6",
  "@types/react": "^18.2.46",
  "@types/react-dom": "^18.2.18",
  "@types/better-sqlite3": "^7.6.8",
  "typescript": "^5.3.3"
}
```

---

## Quick Reference

**Start Development:**
```bash
npm run dev
```

**Build Production:**
```bash
npm run build && npm start
```

**Main Files to Edit:**
- UI: `app/page.tsx`
- Styles: `app/globals.css`
- API: `app/api/notes/route.ts`
- Database: `lib/db.ts`

**API Endpoints:**
- Notes: `/api/notes`
- Single Note: `/api/notes/[id]`
- Categories: `/api/categories`
- Tags: `/api/tags`

**Documentation:**
- Setup: `README.md`
- Design: `DESIGN_GUIDE.md`
- Implementation: `WEB_IMPLEMENTATION.md`
