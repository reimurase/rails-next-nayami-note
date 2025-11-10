import axios, { AxiosResponse, AxiosError } from "axios";

export const fetcher = (url: string) =>
  axios
    .get(url)
    .then((res: AxiosResponse) => res.data)
    .catch((err: AxiosError) => {
      console.error(err.message);
      throw err;
    });
