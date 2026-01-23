# JOLT — Editorial Notes Web App

A minimal, offline-first notes application built with Next.js, featuring a distinctive editorial design aesthetic.

## Design Philosophy

**Brutally minimal, editorial-inspired interface:**
- Typography: Crimson Text (serif display) + IBM Plex Mono (monospace body)
- Color: Stark black/white with electric lime accent (#CCFF00)
- Layout: Diagonal note cards that overlap like scattered papers
- Motion: Staggered reveals, hover tilts, smooth transitions

## Features

- ✅ Create, read, update, delete notes
- ✅ Pin important notes to the top
- ✅ Mark notes as favorites
- ✅ Tag organization with comma-separated input
- ✅ Real-time search across titles and content
- ✅ In-memory storage (data persists during session)
- ✅ Distinctive, memorable UI that avoids generic design patterns

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: In-memory storage (for demo purposes)
- **Animation**: Framer Motion
- **Styling**: CSS-in-JSX with custom properties
- **Date Formatting**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:

**Option A: Local access only**
```bash
npm run dev
```

**Option B: Network access (recommended for LAN access)**
```bash
./start.sh
# or
npm run dev:network
```

3. Access the application:
   - **Local**: [http://localhost:3000](http://localhost:3000)
   - **Network**: `http://YOUR_LOCAL_IP:3000` (displayed when using start.sh)


### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
NOTES_APP/
├── app/
│   ├── api/
│   │   ├── notes/
│   │   │   ├── route.ts          # GET all notes, POST new note
│   │   │   └── [id]/route.ts     # GET, PATCH, DELETE specific note
│   │   ├── categories/route.ts   # Category management
│   │   └── tags/route.ts         # Tag management
│   ├── globals.css               # Global styles & design system
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main notes interface
├── lib/
│   └── db.ts                     # SQLite database service
├── types/
│   └── index.ts                  # TypeScript interfaces
├── package.json
├── tsconfig.json
└── next.config.js
```

## Core Features Implementation

### Notes Management
- **Create**: Click "+ New Note" to open modal
- **Edit**: Click any note card to edit
- **Delete**: Open note and click "Delete" button
- **Pin**: Click pin icon (📌) to pin/unpin notes
- **Favorite**: Toggle favorite checkbox in edit modal

### Search
- Type in search bar to filter notes by title or content
- Results update in real-time with debouncing

### Tags
- Add tags as comma-separated values (e.g., "work, urgent, ideas")
- Tags are automatically created and associated with notes
- Displayed as black chips on note cards

### Database Schema

**Notes Table:**
- id, title, content, createdAt, updatedAt, isPinned, isFavorite, categoryId

**Categories Table:**
- id, name, color, createdAt

**Tags Table:**
- id, name, createdAt

**NoteTags Junction Table:**
- noteId, tagId

## Design Principles Applied

Following the frontend-design skill guidelines:

1. **Typography**: Distinctive font pairing (Crimson Text + IBM Plex Mono)
2. **Color**: High-contrast scheme with singular accent color
3. **Motion**: CSS animations with staggered delays, hover transforms
4. **Spatial Composition**: Diagonal card rotations, asymmetric hover states
5. **Visual Details**: Custom scrollbar, dramatic shadows on hover, accent underlines

## API Endpoints

- `GET /api/notes` - Fetch all notes
- `GET /api/notes?q={query}` - Search notes
- `POST /api/notes` - Create new note
- `GET /api/notes/[id]` - Get specific note
- `PATCH /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note
- `GET /api/categories` - Fetch all categories
- `POST /api/categories` - Create category
- `GET /api/tags` - Fetch all tags

## Future Enhancements

From the original PRD, these features can be added:
- Category color coding and filtering
- Export/import notes functionality
- Light/dark theme toggle
- Advanced filtering by category and tags
- Backup and restore
- Font size preferences

## License

MIT
