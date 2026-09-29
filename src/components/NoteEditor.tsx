import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import type { Note } from '../types';
import { formatDate, TextButton } from '../styles';

const Editor = styled.section`display: flex; flex-direction: column; min-width: 0; padding: 32px 36px; @media(max-width:700px) { padding: 25px 20px; }`;
const Toolbar = styled.div`display: flex; justify-content: space-between; gap: 12px; align-items: center; color: #929787; font-size: 12px; margin-bottom: 28px;`;
const Title = styled.input`
  width: 100%; min-width: 0; border: 0; background: transparent; padding: 4px 0 15px;
  font-family: Georgia, serif; font-size: clamp(25px, 3vw, 34px); color: #35422f;
  &::placeholder { color: #a0a591; }
`;
const Textarea = styled.textarea`
  flex: 1; width: 100%; min-height: 370px; resize: vertical; border: 0;
  background: transparent; color: #56604d; font-size: 15px; line-height: 1.9;
  padding: 15px 0; &::placeholder { color: #a1a695; }
`;
const Bottom = styled.div`border-top: 1px solid #eeeee6; padding-top: 17px; color: #969b8c; font-size: 11px; display: flex; gap: 14px; flex-wrap: wrap;`;

interface Props {
  note: Note;
  onUpdate: (id: string, changes: Pick<Note, 'title' | 'body'>) => void;
  onDelete: (id: string) => void;
}

export function NoteEditor({ note, onUpdate, onDelete }: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  useEffect(() => { titleRef.current?.focus(); }, [note.id]);
  const words = note.body.trim() ? note.body.trim().split(/\s+/u).length : 0;
  function handleDelete() {
    if (window.confirm(`Удалить запись «${note.title.trim() || 'Без названия'}»?`)) onDelete(note.id);
  }
  return <Editor aria-label="Редактор записи">
    <Toolbar><span>ЗАПИСЬ · {formatDate(note.updatedAt)}</span><TextButton onClick={handleDelete}>Удалить запись</TextButton></Toolbar>
    <Title ref={titleRef} aria-label="Заголовок записи" placeholder="Без названия" maxLength={120} value={note.title} onChange={event => onUpdate(note.id, { title: event.target.value, body: note.body })} />
    <Textarea aria-label="Текст записи" placeholder="Начните писать. Здесь есть место для любой мысли…" value={note.body} onChange={event => onUpdate(note.id, { title: note.title, body: event.target.value })} />
    <Bottom><span>Слов: {words}</span><span>Символов в тексте: {note.body.length}</span><span>Можно просто писать — кнопка сохранения не нужна</span></Bottom>
  </Editor>;
}
