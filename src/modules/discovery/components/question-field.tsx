"use client";

import type { DiscoveryQuestion } from "@/engines/discovery";

interface QuestionFieldProps {
  question: DiscoveryQuestion;
  value: string | string[] | undefined;
  error?: string;
  onChange: (value: string | string[]) => void;
}

export function QuestionField({
  question,
  value,
  error,
  onChange,
}: QuestionFieldProps) {
  const fieldId = `question-${question.id}`;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label htmlFor={fieldId} className="block text-base font-medium text-ink">
          {question.label}
          {question.required ? (
            <span className="ml-1 text-accent" aria-hidden>
              *
            </span>
          ) : null}
        </label>
        {question.description ? (
          <p className="text-sm text-muted">{question.description}</p>
        ) : null}
      </div>

      {question.type === "text" ? (
        <input
          id={fieldId}
          type="text"
          value={typeof value === "string" ? value : ""}
          placeholder={question.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full border border-border bg-white/80 px-4 py-3 text-ink outline-none transition focus:border-accent"
        />
      ) : null}

      {question.type === "textarea" ? (
        <textarea
          id={fieldId}
          value={typeof value === "string" ? value : ""}
          placeholder={question.placeholder}
          rows={4}
          onChange={(event) => onChange(event.target.value)}
          className="w-full resize-y border border-border bg-white/80 px-4 py-3 text-ink outline-none transition focus:border-accent"
        />
      ) : null}

      {question.type === "select" ? (
        <select
          id={fieldId}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          className="w-full border border-border bg-white/80 px-4 py-3 text-ink outline-none transition focus:border-accent"
        >
          <option value="">Select an option</option>
          {question.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}

      {question.type === "multiselect" ? (
        <div className="grid gap-2 sm:grid-cols-2" role="group" aria-labelledby={fieldId}>
          <span id={fieldId} className="sr-only">
            {question.label}
          </span>
          {question.options?.map((option) => {
            const selected = Array.isArray(value) && value.includes(option.value);
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 border px-3 py-3 transition ${
                  selected
                    ? "border-accent bg-accent/5"
                    : "border-border bg-white/70 hover:border-accent/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => {
                    const current = Array.isArray(value) ? value : [];
                    if (selected) {
                      onChange(current.filter((item) => item !== option.value));
                    } else {
                      onChange([...current, option.value]);
                    }
                  }}
                  className="mt-1"
                />
                <span className="text-sm text-ink">{option.label}</span>
              </label>
            );
          })}
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
