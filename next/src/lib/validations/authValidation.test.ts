import { AUTH_LIMITS, validateResetPasswordOnSubmit } from "./authValidation";

const VALID_PASSWORD = "a".repeat(AUTH_LIMITS.password.min);

describe("validateResetPasswordOnSubmit", () => {
  describe("正常系", () => {
    test("有効なパスワードと一致する確認 → エラーなし", () => {
      expect(validateResetPasswordOnSubmit(VALID_PASSWORD, VALID_PASSWORD)).toEqual({});
    });
  });

  describe("password", () => {
    test("空のとき → 必須エラー", () => {
      const errors = validateResetPasswordOnSubmit("", "");
      expect(errors.password).toBe("パスワードは必須です");
    });

    test("空のとき → passwordConfirmationのエラーは出ない", () => {
      const errors = validateResetPasswordOnSubmit("", "something");
      expect(errors.passwordConfirmation).toBeUndefined();
    });

    test(`${AUTH_LIMITS.password.min}文字未満 → min エラー`, () => {
      const short = "a".repeat(AUTH_LIMITS.password.min - 1);
      const errors = validateResetPasswordOnSubmit(short, short);
      expect(errors.password).toBe(`パスワードは${AUTH_LIMITS.password.min}文字以上です`);
    });

    test(`${AUTH_LIMITS.password.max}文字超 → max エラー`, () => {
      const long = "a".repeat(AUTH_LIMITS.password.max + 1);
      const errors = validateResetPasswordOnSubmit(long, long);
      expect(errors.password).toBe(`パスワードは${AUTH_LIMITS.password.max}文字以内です`);
    });
  });

  describe("passwordConfirmation", () => {
    test("空のとき → 必須エラー", () => {
      const errors = validateResetPasswordOnSubmit(VALID_PASSWORD, "");
      expect(errors.passwordConfirmation).toBe("パスワード確認は必須です");
    });

    test("passwordと不一致 → 一致エラー", () => {
      const errors = validateResetPasswordOnSubmit(VALID_PASSWORD, VALID_PASSWORD + "x");
      expect(errors.passwordConfirmation).toBe("パスワードが一致しません");
    });
  });
});
