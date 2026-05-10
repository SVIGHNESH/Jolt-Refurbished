import JSZip from 'jszip';
import type { Note } from '@/types';

function slugify(s: string): string {
  return (
    s.toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'untitled'
  );
}

function frontmatter(n: Note): string {
  const esc = (v: string) => v.replace(/"/g, '\\"');
  const lines = [
    '---',
    `id: ${n.id}`,
    `title: "${esc(n.title || 'Untitled')}"`,
    `created: ${n.createdAt}`,
    `updated: ${n.updatedAt}`,
    `pinned: ${n.isPinned}`,
    `favorite: ${n.isFavorite}`,
  ];
  if (n.tags?.length) lines.push(`tags: [${n.tags.map((t) => `"${esc(t)}"`).join(', ')}]`);
  lines.push('---', '');
  return lines.join('\n');
}

export function noteToMarkdown(n: Note): string {
  return `${frontmatter(n)}# ${n.title || 'Untitled'}\n\n${n.content || ''}\n`;
}

export function singleNoteFilename(n: Note): string {
  const shortId = n.id.slice(0, 8);
  return `${slugify(n.title || 'untitled')}-${shortId}.md`;
}

export async function buildZip(notes: Note[], userEmail: string): Promise<Uint8Array> {
  const zip = new JSZip();

  zip.file('notes.json', JSON.stringify({
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    user: userEmail,
    count: notes.length,
    notes,
  }, null, 2));

  zip.file(
    'README.txt',
    [
      'JOLT — Notes Export',
      '==========================',
      '',
      `Exported: ${new Date().toISOString()}`,
      `Account:  ${userEmail}`,
      `Notes:    ${notes.length}`,
      '',
      'Contents:',
      '  notes.json        — full backup, re-importable (schemaVersion 1)',
      '  notes/*.md        — one markdown file per note with YAML frontmatter',
      '',
      'The .md files open in any editor: Obsidian, iA Writer, VS Code, etc.',
    ].join('\n'),
  );

  const folder = zip.folder('notes')!;
  const used = new Set<string>();
  for (const n of notes) {
    let name = singleNoteFilename(n);
    let i = 2;
    while (used.has(name)) {
      const shortId = n.id.slice(0, 8);
      name = `${slugify(n.title || 'untitled')}-${shortId}-${i++}.md`;
    }
    used.add(name);
    folder.file(name, noteToMarkdown(n));
  }

  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}
