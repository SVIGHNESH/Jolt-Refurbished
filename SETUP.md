# Quick Setup Guide

## Fixed Issues

The original implementation used `better-sqlite3` which requires C++ compilation. This caused installation failures with newer Node.js versions. 

**Solution:** Replaced with an in-memory storage solution that:
- Works immediately without compilation
- Persists data during the development session
- Can be easily replaced with a real database later

## Installation

```bash
# Clean install (if you had errors before)
rm -rf node_modules package-lock.json
npm install
```

## Running the App

```bash
# Development mode
npm run dev
```

Then open http://localhost:3000

## What's Different

- **Storage**: In-memory (data resets when server restarts)
- **No native dependencies**: Pure JavaScript implementation
- **Faster installation**: No C++ compilation needed

## For Production

To use persistent storage in production, you can:

1. **Use a cloud database**:
   - Vercel Postgres
   - PlanetScale (MySQL)
   - MongoDB Atlas
   - Supabase

2. **Use SQLite with file system**:
   - Requires running on a server with persistent file system
   - Not recommended for serverless deployments like Vercel

3. **Use localStorage** (client-side only):
   - Move storage logic to the client
   - Data only persists in user's browser

## Current Architecture

```
API Routes (Server)
     ↓
In-Memory Database (lib/db.ts)
     ↓
Arrays & Maps
```

The data structure is simple:
- `notes[]` - array of notes
- `categories[]` - array of categories  
- `tags[]` - array of tags
- `noteTags` - Map of note IDs to tag IDs

All CRUD operations work exactly as designed, just without disk persistence.
