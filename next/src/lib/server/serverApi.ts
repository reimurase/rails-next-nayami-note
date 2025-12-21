const baseURL = process.env.API_BASE_URL;

if (!baseURL) {
  throw new Error("API_BASE_URL is not defined");
}

export async function serverGet<T>(path: string): Promise<T> {
  const res = await fetch(`${baseURL}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${path}`);
  }

  return res.json() as Promise<T>;
}
