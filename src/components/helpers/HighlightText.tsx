import { Fragment, type ReactNode } from "react";

export function highlightText(text: string, query: string): ReactNode {
  const trimmed = query.trim();
  if (!trimmed) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmed.toLowerCase();

  const parts: ReactNode[] = [];
  let start = 0;
  let index = lowerText.indexOf(lowerQuery, start);

  while (index !== -1) {
    if (index > start) {
      parts.push(text.slice(start, index));
    }

    parts.push(
      <mark
        key={index}
        className="rounded bg-primary/20 px-0.5 text-foreground"
      >
        {text.slice(index, index + trimmed.length)}
      </mark>,
    );

    start = index + trimmed.length;
    index = lowerText.indexOf(lowerQuery, start);
  }

  if (start < text.length) {
    parts.push(text.slice(start));
  }

  return parts.map((part, i) => <Fragment key={i}>{part}</Fragment>);
}
