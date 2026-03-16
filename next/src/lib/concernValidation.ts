// src/lib/validation/concern.ts
import type { ApiFieldError } from "@/lib/api/error";

export const CONCERN_LIMITS = {
  triggerEvent: 120,
  content: 1000,
  contentWarn: 800,
} as const;

export type ConcernValues = {
  triggerEvent: string;
  content: string;
};

export type ConcernErrors = Partial<Record<keyof ConcernValues, string>>;

export const hasErrors = (errors: ConcernErrors) => Object.keys(errors).length > 0;

export const validateRequired = (v: ConcernValues): ConcernErrors => {
  const errors: ConcernErrors = {};

  if (!v.content.trim()) {
    errors.content = "なやみは必須です";
  }

  return errors;
};

export const validateLength = (v: ConcernValues): ConcernErrors => {
  const errors: ConcernErrors = {};

  if (v.triggerEvent.trim().length > CONCERN_LIMITS.triggerEvent) {
    errors.triggerEvent = `きっかけは${CONCERN_LIMITS.triggerEvent}文字以内です`;
  }

  if (v.content.trim().length > CONCERN_LIMITS.content) {
    errors.content = `なやみは${CONCERN_LIMITS.content}文字以内です`;
  }

  return errors;
};

export const validateOnSubmit = (v: ConcernValues): ConcernErrors => ({
  ...validateRequired(v),
  ...validateLength(v),
});

const getMax = (meta: Record<string, unknown> | undefined): number | undefined => {
  const max = meta?.max;
  return typeof max === "number" ? max : undefined;
};

function toConcernApiFieldErrors(apiErrors: Record<string, ApiFieldError[]>) {
  return {
    content: apiErrors["content"],
    triggerEvent: apiErrors["trigger_event"],
  };
}

function messageForConcernField(
  field: keyof ConcernValues,
  err: ApiFieldError
): string | undefined {
  if (field === "content") {
    if (err.code === "blank") return "なやみは必須です";
    if (err.code === "too_long") {
      const max = getMax(err.meta) ?? CONCERN_LIMITS.content;
      return `なやみは${max}文字以内です`;
    }
  }

  if (field === "triggerEvent") {
    if (err.code === "too_long") {
      const max = getMax(err.meta) ?? CONCERN_LIMITS.triggerEvent;
      return `きっかけは${max}文字以内です`;
    }
  }

  return undefined;
}

export function mapConcernValidationErrors(
  apiErrors: Record<string, ApiFieldError[]>
): ConcernErrors {
  const out: ConcernErrors = {};
  const errors = toConcernApiFieldErrors(apiErrors);

  for (const field of ["content", "triggerEvent"] as const) {
    const first = errors[field]?.[0];
    if (!first) continue;

    const message = messageForConcernField(field, first);
    if (message) {
      out[field] = message;
    }
  }

  return out;
}
