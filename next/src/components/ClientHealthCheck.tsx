"use client";

import useSWR from "swr";

import { fetcher } from "@/utils";

export function ClientHealthCheck() {
  const url = "http://localhost:3000/api/v1/health_check";
  const { data, error } = useSWR(url, fetcher);

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  return <div>Client fetch: {data.message}</div>;
}
