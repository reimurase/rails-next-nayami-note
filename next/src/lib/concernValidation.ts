export const CONCERN_LIMITS = {
  trigger_event: 120,
  content: 1000,
  contentWarn: 800,
} as const;

export type ConcernValues = {
  trigger_event: string;
  content: string;
};

export type ConcernErrors = Partial<Record<keyof ConcernValues, string>>;

export const validateConcern = (v: ConcernValues): ConcernErrors => {
  const errors: ConcernErrors = {};

  const trigger = v.trigger_event.trim();
  const content = v.content.trim();

  // 必須
  if (!content) errors.content = "なやみは必須です";

  // 文字数
  if (trigger.length > CONCERN_LIMITS.trigger_event) {
    errors.trigger_event = `きっかけは${CONCERN_LIMITS.trigger_event}文字以内です`;
  }

  if (content.length > CONCERN_LIMITS.content) {
    errors.content = `なやみは${CONCERN_LIMITS.content}文字以内です`;
  }

  return errors;
};

export const isValidConcern = (errors: ConcernErrors) => Object.keys(errors).length === 0;
