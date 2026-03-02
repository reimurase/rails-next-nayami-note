let handler: (() => void) | null = null;

export function setOnUnauthorized(fn: (() => void) | null) {
  handler = fn;
}

export function notifyUnauthorized() {
  handler?.();
}
