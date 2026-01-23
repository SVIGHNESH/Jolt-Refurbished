import { Note, Category, Tag } from '@/types';

// In-memory database (for demo purposes - in production, use a real database)
let notes: Note[] = [];
let categories: Category[] = [];
let tags: Tag[] = [];
let noteTags: Map<string, string[]> = new Map(); // noteId -> tagIds

export class DatabaseService {
  // Notes CRUD
  static createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const newNote: Note = {
      ...note,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    // Add tags
    if (note.tags && note.tags.length > 0) {
      const tagIds = note.tags.map(tagName => {
        let tag = tags.find(t => t.name === tagName);
        if (!tag) {
          tag = this.createTag(tagName);
        }
        return tag.id;
      });
      noteTags.set(id, tagIds);
    }
    
    notes.push(newNote);
    return newNote;
  }

  static getAllNotes(): Note[] {
    return notes
      .map(note => ({
        ...note,
        tags: this.getTagsForNote(note.id)
      }))
      .sort((a, b) => {
        // Pinned notes first
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1;
        }
        // Then by date
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }

  static getNoteById(id: string): Note | null {
    const note = notes.find(n => n.id === id);
    if (!note) return null;
    
    return {
      ...note,
      tags: this.getTagsForNote(note.id)
    };
  }

  static updateNote(id: string, updates: Partial<Note>): Note | null {
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString();
    notes[index] = {
      ...notes[index],
      ...updates,
      updatedAt: now,
    };

    // Update tags
    if (updates.tags !== undefined) {
      const tagIds = updates.tags.map(tagName => {
        let tag = tags.find(t => t.name === tagName);
        if (!tag) {
          tag = this.createTag(tagName);
        }
        return tag.id;
      });
      noteTags.set(id, tagIds);
    }

    return this.getNoteById(id);
  }

  static deleteNote(id: string): boolean {
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return false;
    
    notes.splice(index, 1);
    noteTags.delete(id);
    return true;
  }

  static searchNotes(query: string): Note[] {
    const lowerQuery = query.toLowerCase();
    return notes
      .filter(note => 
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery)
      )
      .map(note => ({
        ...note,
        tags: this.getTagsForNote(note.id)
      }))
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1;
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }

  // Categories CRUD
  static createCategory(name: string, color: string): Category {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const category: Category = { id, name, color, createdAt: now };
    categories.push(category);
    return category;
  }

  static getAllCategories(): Category[] {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }

  static deleteCategory(id: string): boolean {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    categories.splice(index, 1);
    return true;
  }

  // Tags CRUD
  static createTag(name: string): Tag {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const tag: Tag = { id, name, createdAt: now };
    tags.push(tag);
    return tag;
  }

  static getAllTags(): Tag[] {
    return [...tags].sort((a, b) => a.name.localeCompare(b.name));
  }

  static getTagsForNote(noteId: string): string[] {
    const tagIds = noteTags.get(noteId) || [];
    return tagIds
      .map(tagId => tags.find(t => t.id === tagId)?.name)
      .filter(Boolean) as string[];
  }
}
