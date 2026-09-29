import styled from '@emotion/styled';
import { formatDate, PrimaryButton } from '../styles';
import type { Note } from '../types';

const Sidebar = styled.aside`
  background: #f9f9f4; border-right: 1px solid #e6e6dd; padding: 24px 18px;
  display: flex; flex-direction: column; gap: 20px; min-width: 0;
  @media (max-width: 700px) { border-right: 0; border-bottom: 1px solid #e6e6dd; }
`;
const Search = styled.input`
  width: 100%; border: 1px solid #e0e2d6; background: white; padding: 12px;
  border-radius: 10px; color: #30382f; font-size: 14px;
`;
const Label = styled.div`display: flex; justify-content: space-between; color: #777e6e; font-size: 11px; letter-spacing: 1.5px;`;
const List = styled.ul`
  list-style: none; margin: -8px 0 0; padding: 0; display: grid; gap: 8px;
  max-height: 520px; overflow-y: auto;
  @media (max-width: 700px) { max-height: 230px; }
`;
const Item = styled.button<{ active: boolean }>`
  display: block; width: 100%; text-align: left; border-radius: 12px; padding: 16px;
  border: 1px solid ${p => p.active ? '#d9dfc6' : 'transparent'};
  background: ${p => p.active ? '#eaf0dd' : 'transparent'}; color: #35422f;
  &:hover { background: #eef0e5; }
  strong { display: block; font-size: 14px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  p { margin: 8px 0 13px; color: #7a8071; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  time { font-size: 11px; color: #858b7b; }
`;
const Empty = styled.p`color: #7c8275; font-size: 14px; line-height: 1.7; padding: 0 8px;`;

interface Props {
  notes: Note[];
  selectedId: string | null;
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

export function NotesSidebar({ notes, selectedId, query, onQueryChange, onSelect, onCreate }: Props) {
  return <Sidebar aria-label="Меню записей">
    <PrimaryButton onClick={onCreate}>＋ Новая запись</PrimaryButton>
    <Search type="search" aria-label="Поиск записей" placeholder="Поиск по заголовку и тексту…" value={query} onChange={event => onQueryChange(event.target.value)} />
    <Label><span>{query.trim() ? 'НАЙДЕНО' : 'ВСЕ ЗАПИСИ'}</span><span aria-live="polite">{notes.length}</span></Label>
    <List>{notes.map(note => <li key={note.id}>
      <Item active={note.id === selectedId} aria-current={note.id === selectedId ? 'true' : undefined} onClick={() => onSelect(note.id)}>
        <strong>{note.title.trim() || 'Без названия'}</strong>
        <p>{note.body.trim() || 'Пока пустая запись'}</p>
        <time dateTime={note.updatedAt}>{formatDate(note.updatedAt)}</time>
      </Item>
    </li>)}</List>
    {!notes.length && <Empty>{query.trim() ? 'Ничего не найдено. Попробуйте другой запрос.' : 'Начните с новой записи — здесь будет ваш список.'}</Empty>}
  </Sidebar>;
}
