# JOLT Web - Minimal PRD Implementation

## Overview
This is a minimal web implementation of the JOLT notes app (from PRD.md) built entirely in Next.js with a distinctive, memorable UI following the frontend-design skill guidelines.

## Design Concept: Editorial Minimalism

**Aesthetic Direction:** Magazine editorial meets Swiss design
- **Typography:** Crimson Text (serif) + IBM Plex Mono (monospace)
- **Color Palette:** Stark black (#0A0A0A) on off-white (#FAFAFA) with electric lime accent (#CCFF00)
- **Unforgettable Element:** Diagonal note cards that rotate and lift on hover, creating a scattered desk papers effect
- **Motion:** Staggered fade-in animations, smooth hover transforms, morphing transitions

## Core Features Implemented

### From PRD User Stories:

✅ **US-002/003**: Database schema with SQLite
- Notes, Categories, Tags, NoteTags tables
- Full CRUD operations via DatabaseService

✅ **US-004**: Notes list with Material Design principles (adapted to editorial style)
- All notes displayed with preview
- Pinned notes at top (with visual distinction)
- Empty state handling

✅ **US-005**: Note creation/editing
- Full-screen modal editor
- Title and content fields
- Tag input (comma-separated)
- Pin and favorite toggles
- Delete with confirmation
- Timestamps displayed

✅ **US-007**: Tag management
- Create tags on the fly
- Tags displayed as black chips
- Tags persist with notes

✅ **US-008**: Search functionality
- Real-time search across title and content
- Search bar in header
- Results update dynamically

✅ **US-009**: Note sorting and pinning
- Pin toggle on each card
- Pinned notes always at top
- Favorite star marking

### Additional Features:
- Framer Motion animations for smooth transitions
- Responsive design (mobile-first)
- Custom scrollbar styling
- Hover effects with dramatic shadows
- Clean, functional UI without clutter

## Project Structure

```
NOTES_APP/
├── app/
│   ├── api/
│   │   ├── notes/
│   │   │   ├── route.ts          # Notes CRUD endpoints
│   │   │   └── [id]/route.ts     # Single note operations
│   │   ├── categories/route.ts   # Category endpoints
│   │   └── tags/route.ts         # Tag endpoints
│   ├── globals.css               # Design system & animations
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main interface
├── lib/
│   └── db.ts                     # SQLite database service
├── types/
│   └── index.ts                  # TypeScript types
├── package.json
├── tsconfig.json
├── next.config.js
├── README.md
└── .gitignore
```

## Technology Choices

| Technology | Purpose |
|-----------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| better-sqlite3 | Offline SQLite database |
| Framer Motion | Smooth animations |
| date-fns | Date formatting |

## Design System

### CSS Variables
```css
--color-bg: #FAFAFA
--color-text: #0A0A0A
--color-accent: #CCFF00 (electric lime)
--color-muted: #666666
--font-display: Crimson Text (serif)
--font-mono: IBM Plex Mono (monospace)
```

### Key Design Elements
1. **Large Display Typography**: 5.5rem title with tight letter-spacing
2. **Uppercase Labels**: Small-caps style for metadata
3. **Diagonal Cards**: -1deg rotation + translateY on hover
4. **Dramatic Shadows**: 12px offset box-shadow on hover
5. **Accent Underlines**: Animated scaleX transform from left
6. **Staggered Animations**: 0.05s delay between card reveals

## Setup Instructions

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Open browser:**
```
http://localhost:3000
```

## What's Different from Generic AI Design

❌ **Avoided:**
- Inter/Roboto fonts
- Purple gradients
- Generic Material UI components
- Rounded corners everywhere
- Soft shadows
- Predictable grid layouts

✅ **Used Instead:**
- Distinctive serif + mono pairing
- Stark monochrome + single accent
- Custom-built components
- Sharp edges and borders
- Dramatic, geometric shadows
- Asymmetric hover states

## Future Enhancements (from PRD)

The following can be added to reach feature parity with the Flutter PRD:

- Category color coding and management UI
- Export/import functionality (JSON/Markdown)
- Light/dark theme toggle
- Advanced filtering by category/tag
- Automatic backups
- Settings page
- Font size preferences
- Sort order customization

## Performance Considerations

- Server-side rendering for initial load
- Client-side state management with React hooks
- Optimistic UI updates
- Debounced search queries
- AnimatePresence for smooth list transitions
- SQLite indexes on isPinned and categoryId

## Accessibility Features

- Semantic HTML
- Keyboard navigation support
- Focus states on all interactive elements
- ARIA labels where needed
- Sufficient color contrast
- Readable font sizes

---

**Result:** A minimal, functional, and visually distinctive notes app that prioritizes user experience and aesthetic coherence over feature bloat.
