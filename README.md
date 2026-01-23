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

### Network Access

To allow other devices on your network to access JOLT:

#### Quick Start (Recommended)

```bash
chmod +x start.sh
./start.sh
```

The script will automatically:
- Install dependencies if needed
- Detect your local IP address
- Start the server with network access enabled
- Display both local and network URLs

#### Alternative Methods

**Method 1: Using npm script**
```bash
npm run dev:network
```

**Method 2: Get your network URL**
```bash
./get-network-url.sh
```

**Method 3: Find IP manually**
```bash
# Linux
ip addr show | grep 'inet ' | grep -v '127.0.0.1'

# The IP will look like: 192.168.x.x or 10.x.x.x
# Then access: http://YOUR_IP:3000
```

#### Access from Other Devices

Once the server is running with network access:
1. Other devices must be on the **same WiFi/LAN network**
2. Open browser on the device
3. Go to: `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`
   - Your actual IP is shown when you run `./start.sh`

#### Troubleshooting

**Can't access from another device?**

1. **Check firewall** - Allow port 3000:
   ```bash
   sudo ufw allow 3000/tcp
   ```

2. **Verify network** - Both devices must be on same network:
   ```bash
   # On server machine
   ip addr show | grep 'inet '
   ```

3. **Test locally first**:
   ```bash
   curl http://localhost:3000/api/notes
   # Should return: []
   ```

4. **Test network access from server**:
   ```bash
   curl http://YOUR_IP:3000/api/notes
   # Should also return: []
   ```

**Note**: When using `npm run dev:network`, Next.js shows "Network: http://0.0.0.0:3000" - this means "all interfaces". Use your actual IP address (shown by `./start.sh` or `./get-network-url.sh`) to access from other devices.

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
