/* Componentes reutilizáveis da interface (Documento 06, seção 15).
 * Apenas apresentação: recebem propriedades e emitem eventos. */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { ValidationStatus } from '../domain/types';

/** Indicador de localização (Doc. 06, seção 4.3). */
export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Você está em" className="label mb-3 flex flex-wrap gap-x-2 gap-y-1">
      {items.map((item, i) => (
        <span key={i} className="flex gap-2">
          {i > 0 && <span aria-hidden="true">/</span>}
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader(props: { crumbs: { label: string; to?: string }[]; title: string; lede?: string; children?: ReactNode }) {
  return (
    <header className="pb-6">
      <Breadcrumb items={props.crumbs} />
      <h1>{props.title}</h1>
      {props.lede && <p className="hint mt-2 text-[1.15rem]">{props.lede}</p>}
      {props.children}
    </header>
  );
}

export function Section({ title, children, id, aside }: { title: string; children: ReactNode; id?: string; aside?: ReactNode }) {
  const auto = useId();
  const headingId = id ?? auto;
  return (
    <section aria-labelledby={headingId} className="rule-top mb-8">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={headingId}>{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function Tag({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return <span className={`tag ${accent ? 'tag-accent' : ''}`}>{children}</span>;
}

const STATUS_TEXT: Record<ValidationStatus, string> = {
  proposta: 'Proposta · aguarda revisão',
  validada: 'Validada',
  suspensa: 'Suspensa',
};

/** Estado de validação do conteúdo (Doc. 04, seção 14). */
export function StatusTag({ status }: { status: ValidationStatus }) {
  return <Tag>{STATUS_TEXT[status]}</Tag>;
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="card text-center">
      <p className="font-display text-xl">{title}</p>
      <div className="hint mt-1">{children}</div>
    </div>
  );
}

export function Field(props: { label: string; hint?: string; error?: string; children: (id: string, describedBy: string | undefined) => ReactNode }) {
  const id = useId();
  const noteId = `${id}-note`;
  const note = props.error ?? props.hint;
  return (
    <div className="mb-4">
      <label htmlFor={id} className="label mb-1.5">
        {props.label}
      </label>
      {props.children(id, note ? noteId : undefined)}
      {note && (
        <p id={noteId} role={props.error ? 'alert' : undefined} className={`mt-1 text-[0.95rem] ${props.error ? 'text-accent' : 'hint'}`}>
          {props.error ? `⚠ ${props.error}` : props.hint}
        </p>
      )}
    </div>
  );
}

interface TextProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  placeholder?: string;
  rows?: number;
  type?: 'text' | 'date' | 'email' | 'password' | 'search';
  autoComplete?: string;
}

export function TextInput(props: TextProps) {
  return (
    <Field label={props.label} hint={props.hint} error={props.error}>
      {(id, describedBy) => (
        <input
          id={id}
          type={props.type ?? 'text'}
          className="field"
          value={props.value}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
          aria-describedby={describedBy}
          aria-invalid={props.error ? true : undefined}
          onChange={(e) => props.onChange(e.target.value)}
        />
      )}
    </Field>
  );
}

export function TextArea(props: TextProps) {
  return (
    <Field label={props.label} hint={props.hint} error={props.error}>
      {(id, describedBy) => (
        <textarea
          id={id}
          className="field"
          rows={props.rows ?? 3}
          value={props.value}
          placeholder={props.placeholder}
          aria-describedby={describedBy}
          aria-invalid={props.error ? true : undefined}
          onChange={(e) => props.onChange(e.target.value)}
        />
      )}
    </Field>
  );
}

/** Área de texto que grava sozinha ao sair do campo ou após uma pausa (Doc. 06, seção 9.4). */
export function AutoSaveArea(props: { label: string; value: string; onSave: (value: string) => void; hint?: string; rows?: number; disabled?: boolean }) {
  const [text, setText] = useState(props.value);
  const saved = useRef(props.value);
  const onSave = useRef(props.onSave);
  onSave.current = props.onSave;

  useEffect(() => {
    if (props.value !== saved.current) {
      saved.current = props.value;
      setText(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    if (text === saved.current) return;
    const timer = setTimeout(() => {
      saved.current = text;
      onSave.current(text);
    }, 900);
    return () => clearTimeout(timer);
  }, [text]);

  function flush() {
    if (text !== saved.current) {
      saved.current = text;
      onSave.current(text);
    }
  }

  return (
    <Field label={props.label} hint={props.hint}>
      {(id, describedBy) => (
        <textarea id={id} className="field" rows={props.rows ?? 3} value={text} disabled={props.disabled} aria-describedby={describedBy} onChange={(e) => setText(e.target.value)} onBlur={flush} />
      )}
    </Field>
  );
}

/** Grupo de opções de toque. Valores fora da lista aparecem como "Outro(a)". */
export function Chips(props: { legend: string; options: readonly string[]; value: string[]; onChange: (value: string[]) => void; multiple?: boolean; allowOther?: boolean; hint?: string }) {
  const name = useId();
  const { options, value, multiple } = props;
  const custom = value.filter((v) => !options.includes(v));
  const [otherOpen, setOtherOpen] = useState(custom.length > 0);
  const otherText = custom.join(', ');

  function toggle(option: string) {
    if (multiple) props.onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
    else props.onChange(value.includes(option) ? [] : [option]);
  }

  function setOther(text: string) {
    const known = value.filter((v) => options.includes(v));
    const typed = text.trim() ? [text] : [];
    props.onChange(multiple ? [...known, ...typed] : typed.length ? typed : known);
  }

  return (
    <fieldset className="mb-4 min-w-0 border-0 p-0">
      <legend className="label mb-1.5">{props.legend}</legend>
      {props.hint && <p className="hint mb-2 text-[0.95rem]">{props.hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="chip">
            <input type="checkbox" name={name} checked={value.includes(option)} onChange={() => toggle(option)} />
            <span>{option}</span>
          </label>
        ))}
        {props.allowOther && (
          <label className="chip">
            <input
              type="checkbox"
              name={name}
              checked={otherOpen}
              onChange={() => {
                if (otherOpen) setOther('');
                setOtherOpen(!otherOpen);
              }}
            />
            <span>Outro</span>
          </label>
        )}
      </div>
      {props.allowOther && otherOpen && (
        <input type="text" className="field mt-2" aria-label={`${props.legend}: outro`} placeholder="Qual?" value={otherText} onChange={(e) => setOther(e.target.value)} />
      )}
    </fieldset>
  );
}

/** Confirmação em dois toques para operações destrutivas (RNF-027). */
export function ConfirmButton(props: { label: string; confirmLabel: string; onConfirm: () => void; className?: string }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 5000);
    return () => clearTimeout(timer);
  }, [armed]);
  return (
    <button
      type="button"
      className={`${props.className ?? 'btn btn-ghost btn-sm'} ${armed ? '!border-accent !text-accent' : ''}`}
      onClick={() => {
        if (armed) {
          setArmed(false);
          props.onConfirm();
        } else setArmed(true);
      }}
    >
      {armed ? `⚠ ${props.confirmLabel}` : props.label}
    </button>
  );
}

/** Conteúdo extenso em camadas (Doc. 06, seção 2.1). */
export function Accordion({ title, children, open }: { title: ReactNode; children: ReactNode; open?: boolean }) {
  return (
    <details className="border-t border-rule py-3" open={open}>
      <summary className="font-display text-[1.15rem]">{title}</summary>
      <div className="pt-3">{children}</div>
    </details>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="prose-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Aviso com borda de acento: orientações, limites e transparência. */
export function Notice({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="entry my-4">
      {title && <p className="label mb-1">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
