// NOTE: サーバーからの GET は「ログイン不要」用途のみ。ログイン必須は clientApi + SWR。

function getBaseUrl() {
  const baseURL = process.env.API_BASE_URL;
  if (!baseURL) {
    throw new Error("API_BASE_URL is not defined");
  }
  return baseURL;
}

export async function serverGet<T>(path: string): Promise<T> {
  const baseURL = getBaseUrl();

  const res = await fetch(`${baseURL}${path}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${path}`);
  }

  return (await res.json()) as T;
}
