import type { ApiFieldError } from "@/lib/api/error";

export const AUTH_LIMITS = {
  email: 255,
  password: {
    min: 8,
    max: 72,
  },
} as const;

export type SignupValues = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type LoginValues = {
  email: string;
  password: string;
};

export type AuthErrors = Partial<Record<"email" | "password" | "passwordConfirmation", string>>;

export const hasErrors = (errors: AuthErrors) => Object.keys(errors).length > 0;

const EMAIL_REGEXP = /^[\w+\-.]+@[a-z\d\-.]+\.[a-z]+$/i;

export const validateEmailFormat = (email: string): string | undefined => {
  if (email.trim() && !EMAIL_REGEXP.test(email)) {
    return "メールアドレスの形式が正しくありません";
  }
  return undefined;
};

export const validateSignupRequired = (v: SignupValues): AuthErrors => {
  const errors: AuthErrors = {};
  if (!v.email.trim()) errors.email = "メールアドレスは必須です";
  if (!v.password) errors.password = "パスワードは必須です";
  if (!v.passwordConfirmation) errors.passwordConfirmation = "パスワード確認は必須です";
  return errors;
};

export const validateLoginRequired = (v: LoginValues): AuthErrors => {
  const errors: AuthErrors = {};
  if (!v.email.trim()) errors.email = "メールアドレスは必須です";
  if (!v.password) errors.password = "パスワードは必須です";
  return errors;
};

export const validateSignupLength = (v: SignupValues): AuthErrors => {
  const errors: AuthErrors = {};
  if (v.email.length > AUTH_LIMITS.email) {
    errors.email = `メールアドレスは${AUTH_LIMITS.email}文字以内です`;
  }
  if (v.password && v.password.length < AUTH_LIMITS.password.min) {
    errors.password = `パスワードは${AUTH_LIMITS.password.min}文字以上です`;
  }
  if (v.password && v.passwordConfirmation && v.password !== v.passwordConfirmation) {
    errors.passwordConfirmation = "パスワードが一致しません";
  }
  return errors;
};

export const validateSignupOnSubmit = (v: SignupValues): AuthErrors => {
  const required = validateSignupRequired(v);
  const emailFormatError = !required.email ? validateEmailFormat(v.email) : undefined;
  return {
    ...required,
    ...(emailFormatError ? { email: emailFormatError } : {}),
    ...validateSignupLength(v),
  };
};

export const validateLoginOnSubmit = (v: LoginValues): AuthErrors => ({
  ...validateLoginRequired(v),
});

const getMin = (meta: Record<string, unknown> | undefined): number | undefined => {
  const min = meta?.min;
  return typeof min === "number" ? min : undefined;
};

const getMax = (meta: Record<string, unknown> | undefined): number | undefined => {
  const max = meta?.max;
  return typeof max === "number" ? max : undefined;
};

function messageForAuthField(
  field: "email" | "password" | "passwordConfirmation",
  err: ApiFieldError
): string | undefined {
  if (field === "email") {
    if (err.code === "blank") return "メールアドレスは必須です";
    if (err.code === "invalid" || err.code === "taken")
      return "メールアドレスの形式が正しくありません";
    if (err.code === "too_long") {
      const max = getMax(err.meta) ?? AUTH_LIMITS.email;
      return `メールアドレスは${max}文字以内です`;
    }
  }

  if (field === "password") {
    if (err.code === "blank") return "パスワードは必須です";
    if (err.code === "too_short") {
      const min = getMin(err.meta) ?? AUTH_LIMITS.password.min;
      return `パスワードは${min}文字以上です`;
    }
    if (err.code === "too_long") {
      const max = getMax(err.meta) ?? AUTH_LIMITS.password.max;
      return `パスワードは${max}文字以内です`;
    }
  }

  if (field === "passwordConfirmation") {
    if (err.code === "confirmation") return "パスワードが一致しません";
  }

  return undefined;
}

export const LOGIN_CREDENTIAL_ERROR = "メールアドレスまたはパスワードが正しくありません";

export function mapAuthValidationErrors(apiErrors: Record<string, ApiFieldError[]>): AuthErrors {
  const out: AuthErrors = {};

  const emailErr = apiErrors["email"]?.[0];
  if (emailErr) {
    const msg = messageForAuthField("email", emailErr);
    if (msg) out.email = msg;
  }

  const passwordErr = apiErrors["password"]?.[0];
  if (passwordErr) {
    const msg = messageForAuthField("password", passwordErr);
    if (msg) out.password = msg;
  }

  const passwordConfirmationErr = apiErrors["password_confirmation"]?.[0];
  if (passwordConfirmationErr) {
    const msg = messageForAuthField("passwordConfirmation", passwordConfirmationErr);
    if (msg) out.passwordConfirmation = msg;
  }

  return out;
}
