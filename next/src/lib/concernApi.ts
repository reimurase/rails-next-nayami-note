import { api } from "@/lib/api";
import type { Concern } from "@/components/concerns/ConcernIndex";

type CreateConcernParams = {
  triggerEvent: string;
  content: string;
};

type UpdateConcernParams = {
  id: number;
  triggerEvent: string;
  content: string;
};

type DeleteConcernParams = {
  id: number;
};

export const concernApi = {
  getConcerns: async (): Promise<Concern[]> => {
    const res = await api.get<Concern[]>("/api/v1/concerns");
    return res.data;
  },

  create: ({ triggerEvent, content }: CreateConcernParams) =>
    api.post("/api/v1/concerns", {
      concern: { trigger_event: triggerEvent, content },
    }),

  update: ({ id, triggerEvent, content }: UpdateConcernParams) =>
    api.patch(`/api/v1/concerns/${id}`, {
      concern: { trigger_event: triggerEvent, content },
    }),

  remove: ({ id }: DeleteConcernParams) => api.delete(`/api/v1/concerns/${id}`),
};
