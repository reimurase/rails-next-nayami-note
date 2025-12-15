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

export const hasErrors = (errors: ConcernErrors) => Object.keys(errors).length > 0;

// 必須だけ（送信/保存を押した後にだけ表示したい用途）
export const validateRequired = (v: ConcernValues): ConcernErrors => {
  const errors: ConcernErrors = {};

  // 今の方針：content は必須、trigger_event は必須じゃない
  if (!v.content.trim()) {
    errors.content = "なやみは必須です";
  }

  return errors;
};

// 文字数だけ（入力中も使う用途）
export const validateLength = (v: ConcernValues): ConcernErrors => {
  const errors: ConcernErrors = {};

  const trigger = v.trigger_event.trim();
  const content = v.content.trim();

  if (trigger.length > CONCERN_LIMITS.trigger_event) {
    errors.trigger_event = `きっかけは${CONCERN_LIMITS.trigger_event}文字以内です`;
  }

  if (content.length > CONCERN_LIMITS.content) {
    errors.content = `なやみは${CONCERN_LIMITS.content}文字以内です`;
  }

  return errors;
};

// 送信/保存時の最終チェック（必須 + 文字数）
export const validateOnSubmit = (v: ConcernValues): ConcernErrors => ({
  ...validateRequired(v),
  ...validateLength(v),
});
