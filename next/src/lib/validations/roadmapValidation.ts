import type { ApiFieldError } from "@/lib/api/error";

export const CONCERN_LIMITS = {
  goal: 120,
  content: 1000,
  contentWarn: 800,
} as const;

export type RoadmapValues = {
  goal: string;
  content: string;
};

export type RoadmapErrors = Partial<Record<keyof RoadmapValues, string>>;

export const hasErrors = (errors: RoadmapErrors) => Object.keys(errors).length > 0;

export const validateRequired = (v: RoadmapValues): RoadmapErrors => {
  const errors: RoadmapErrors = {};

  if (!v.content.trim()) {
    errors.content = "ロードマップは必須です";
  }

  return errors;
};

export const validateLength = (v: RoadmapValues): RoadmapErrors => {
  const errors: RoadmapErrors = {};

  if (v.goal.trim().length > CONCERN_LIMITS.goal) {
    errors.goal = `ゴールは${CONCERN_LIMITS.goal}文字以内です`;
  }

  if (v.content.trim().length > CONCERN_LIMITS.content) {
    errors.content = `ロードマップは${CONCERN_LIMITS.content}文字以内です`;
  }

  return errors;
};

export const validateOnSubmit = (v: RoadmapValues): RoadmapErrors => ({
  ...validateRequired(v),
  ...validateLength(v),
});

const getMax = (meta: Record<string, unknown> | undefined): number | undefined => {
  const max = meta?.max;
  return typeof max === "number" ? max : undefined;
};

function toRoadmapApiFieldErrors(apiErrors: Record<string, ApiFieldError[]>) {
  return {
    content: apiErrors["content"],
    goal: apiErrors["trigger_event"],
  };
}

function messageForRoadmapField(
  field: keyof RoadmapValues,
  err: ApiFieldError
): string | undefined {
  if (field === "content") {
    if (err.code === "blank") return "ロードマップは必須です";
    if (err.code === "too_long") {
      const max = getMax(err.meta) ?? CONCERN_LIMITS.content;
      return `ロードマップは${max}文字以内です`;
    }
  }

  if (field === "goal") {
    if (err.code === "too_long") {
      const max = getMax(err.meta) ?? CONCERN_LIMITS.goal;
      return `ゴールは${max}文字以内です`;
    }
  }

  return undefined;
}

export function mapRoadmapValidationErrors(
  apiErrors: Record<string, ApiFieldError[]>
): RoadmapErrors {
  const out: RoadmapErrors = {};
  const errors = toRoadmapApiFieldErrors(apiErrors);

  for (const field of ["content", "goal"] as const) {
    const first = errors[field]?.[0];
    if (!first) continue;

    const message = messageForRoadmapField(field, first);
    if (message) {
      out[field] = message;
    }
  }

  return out;
}
