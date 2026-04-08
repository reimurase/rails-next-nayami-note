// src/lib/validation/issue.ts
import type { ApiFieldError } from "@/lib/api/error";

export const CONCERN_LIMITS = {
  title: 120,
  content: 1000,
  contentWarn: 800,
} as const;

export type IssueValues = {
  title: string;
  content: string;
};

export type IssueErrors = Partial<Record<keyof IssueValues, string>>;

export const hasErrors = (errors: IssueErrors) => Object.keys(errors).length > 0;

export const validateRequired = (v: IssueValues): IssueErrors => {
  const errors: IssueErrors = {};

  if (!v.content.trim()) {
    errors.content = "問題は必須です";
  }

  return errors;
};

export const validateLength = (v: IssueValues): IssueErrors => {
  const errors: IssueErrors = {};

  if (v.title.trim().length > CONCERN_LIMITS.title) {
    errors.title = `タイトルは${CONCERN_LIMITS.title}文字以内です`;
  }

  if (v.content.trim().length > CONCERN_LIMITS.content) {
    errors.content = `問題は${CONCERN_LIMITS.content}文字以内です`;
  }

  return errors;
};

export const validateOnSubmit = (v: IssueValues): IssueErrors => ({
  ...validateRequired(v),
  ...validateLength(v),
});

const getMax = (meta: Record<string, unknown> | undefined): number | undefined => {
  const max = meta?.max;
  return typeof max === "number" ? max : undefined;
};

function toIssueApiFieldErrors(apiErrors: Record<string, ApiFieldError[]>) {
  return {
    content: apiErrors["content"],
    title: apiErrors["trigger_event"],
  };
}

function messageForIssueField(field: keyof IssueValues, err: ApiFieldError): string | undefined {
  if (field === "content") {
    if (err.code === "blank") return "問題は必須です";
    if (err.code === "too_long") {
      const max = getMax(err.meta) ?? CONCERN_LIMITS.content;
      return `問題は${max}文字以内です`;
    }
  }

  if (field === "title") {
    if (err.code === "too_long") {
      const max = getMax(err.meta) ?? CONCERN_LIMITS.title;
      return `タイトルは${max}文字以内です`;
    }
  }

  return undefined;
}

export function mapIssueValidationErrors(apiErrors: Record<string, ApiFieldError[]>): IssueErrors {
  const out: IssueErrors = {};
  const errors = toIssueApiFieldErrors(apiErrors);

  for (const field of ["content", "title"] as const) {
    const first = errors[field]?.[0];
    if (!first) continue;

    const message = messageForIssueField(field, first);
    if (message) {
      out[field] = message;
    }
  }

  return out;
}
