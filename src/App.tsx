import { useState } from 'react';
import styled from '@emotion/styled';
import { useNotes } from './hooks/useNotes';
import { NotesSidebar } from './components/NotesSidebar';
import { NoteEditor } from './components/NoteEditor';
import { PrimaryButton } from './styles';

const Page = styled.main`max-width: 1160px; margin: 0 auto; padding: 32px 24px; @media(max-width:480px) { padding: 22px 12px; }`;
const Header = styled.header`
  display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 36px;
  strong { font-size: 19px; letter-spacing: -.5px; } span { color: #88917c; font-size: 12px; }
`;
const Brand = styled.div`display: flex; align-items: center; gap: 12px;`;
const Logo = styled.div`background: #405441; color: #e5ebcc; width: 38px; height: 38px; border-radius: 12px; display: grid; place-items: center; font-family: Georgia, serif; font-size: 27px;`;
const Intro = styled.div`margin-bottom: 26px; h1 { font-family: Georgia, serif; font-size: clamp(32px, 5vw, 45px); font-weight: 400; margin: 0 0 10px; letter-spacing: -1px; } p { margin: 0; color: #888d7f; line-height: 1.7; font-size: 14px; }`;
const Workspace = styled.div`
  display: grid; grid-template-columns: 290px minmax(0, 1fr); min-height: 610px;
  background: #fffefa; border: 1px solid #e1e3d7; border-radius: 19px; overflow: hidden;
  box-shadow: 0 16px 40px #3a44200a;
  @media(max-width:700px) { grid-template-columns: minmax(0, 1fr); }
`;
const Empty = styled.section`display: grid; place-content: center; justify-items: center; text-align: center; padding: 50px 24px; color: #7e8773; h2 { color: #405441; font-family: Georgia, serif; font-size: 28px; font-weight: 400; } p { line-height: 1.7; margin: 0 0 25px; }`;
const Footer = styled.footer`display: flex; justify-content: space-between; gap: 15px; flex-wrap: wrap; padding: 20px 4px; color: #989e8e; font-size: 11px;`;
const Warning = styled.p`background: #fff0db; color: #835523; padding: 12px; border-radius: 10px; font-size: 13px;`;

export default function App() {
  const { notes, selectedId, selectNote, createNote, updateNote, deleteNote, storageError } = useNotes();
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLocaleLowerCase('ru-RU');
  const filteredNotes = notes.filter(note => `${note.title}\n${note.body}`.toLocaleLowerCase('ru-RU').includes(normalizedQuery));
  // Поиск фильтрует только меню: открытая запись остаётся в редакторе,
  // чтобы ввод не терял фокус, если текст перестал совпадать с запросом.
  const selectedNote = notes.find(note => note.id === selectedId);
  function handleCreate() { setQuery(''); createNote(); }

  return <Page>
    <Header><Brand><Logo aria-hidden="true">м</Logo><strong>между строк</strong></Brand><span>ЛИЧНОЕ ПРОСТРАНСТВО ДЛЯ МЫСЛЕЙ</span></Header>
    <Intro><h1>Мысли, которым есть место.</h1><p>Записывайте важное, возвращайтесь к идеям и находите нужные слова.</p></Intro>
    {storageError && <Warning role="alert">Не удалось сохранить записи в браузере. Не закрывайте страницу: изменения пока доступны только в памяти.</Warning>}
    <Workspace>
      <NotesSidebar notes={filteredNotes} selectedId={selectedId} query={query} onQueryChange={setQuery} onSelect={selectNote} onCreate={handleCreate} />
      {selectedNote ? <NoteEditor note={selectedNote} onUpdate={updateNote} onDelete={deleteNote} />
        : <Empty><h2>С чистого листа</h2><p>Создайте запись, чтобы сохранить<br />идею, план или небольшой конспект.</p><PrimaryButton onClick={handleCreate}>Создать первую запись</PrimaryButton></Empty>}
    </Workspace>
    <Footer><span role="status">{storageError ? 'Сохранение недоступно' : '● Автосохранение в этом браузере'}</span><span>React · TypeScript · Emotion</span></Footer>
  </Page>;
}
