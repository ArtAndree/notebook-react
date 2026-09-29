import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const globalStyles = css`
  * { box-sizing: border-box; }
  body { margin: 0; background: #f4f2ed; color: #30382f; font-family: 'Segoe UI', system-ui, sans-serif; }
  button, input, textarea { font: inherit; }
  button { cursor: pointer; }
  button, input, textarea { -webkit-tap-highlight-color: transparent; }
  :focus-visible { outline: 3px solid #b18a52; outline-offset: 3px; }
  ::selection { background: #e3e9cc; }
`;

export const PrimaryButton = styled.button`
  background: #405441; color: #fff; border: 0; border-radius: 11px;
  padding: 13px 18px; font-weight: 600;
  &:hover { background: #2c422e; }
`;
export const TextButton = styled.button`
  background: transparent; color: #696f64; border: 1px solid #dedfd7;
  border-radius: 9px; padding: 8px 12px; font-size: 13px;
  &:hover { background: #f4f2ed; color: #873d34; }
`;

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(new Date(date));
}
