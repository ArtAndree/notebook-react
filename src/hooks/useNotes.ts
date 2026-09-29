import { useEffect, useState } from 'react';
import type { Note } from '../types';

const STORAGE_KEY = 'react-notebook:v1';
const welcome: Note[] = [{
  id: 'welcome',
  title: 'Место для хороших мыслей',
  body: 'Иногда достаточно записать мысль, чтобы увидеть её яснее.\n\nЭто ваш личный блокнот. Здесь можно собирать идеи, вести конспекты и строить планы.\n\nКак начать:\n• Нажмите «Новая запись».\n• Придумайте заголовок и напишите текст.\n• Выбирайте записи в меню слева.\n• Используйте поиск, чтобы найти нужное.\n\nИзменения сохраняются автоматически в этом браузере. Эту запись можно изменить или удалить.',
  updatedAt: new Date().toISOString(),
}];

function isNote(value: unknown): value is Note {
  if (!value || typeof value !== 'object') return false;
  const note = value as Record<string, unknown>;
  return typeof note.id === 'string' && typeof note.title === 'string'
    && typeof note.body === 'string' && typeof note.updatedAt === 'string'
    && Number.isFinite(Date.parse(note.updatedAt));
}

function readNotes(): Note[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return welcome;
    const data: unknown = JSON.parse(stored);
    if (Array.isArray(data) && data.every(isNote)
      && new Set(data.map(note => note.id)).size === data.length) return data;
  } catch { /* Недоступное хранилище не мешает работать в памяти. */ }
  return welcome;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(readNotes);
  const [selectedId, setSelectedId] = useState<string | null>(() => notes[0]?.id ?? null);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      setStorageError(false);
    } catch { setStorageError(true); }
  }, [notes]);

  function createNote() {
    const note: Note = { id: crypto.randomUUID(), title: '', body: '', updatedAt: new Date().toISOString() };
    setNotes(current => [note, ...current]);
    setSelectedId(note.id);
  }

  function updateNote(id: string, changes: Pick<Note, 'title' | 'body'>) {
    setNotes(current => current.map(note => note.id === id
      ? { ...note, ...changes, updatedAt: new Date().toISOString() } : note));
  }

  function deleteNote(id: string) {
    const remaining = notes.filter(note => note.id !== id);
    setNotes(remaining);
    if (selectedId === id) setSelectedId(remaining[0]?.id ?? null);
  }

  return { notes, selectedId, selectNote: setSelectedId, createNote, updateNote, deleteNote, storageError };
}
