import { api } from "@/lib/api/client";
import type { Concern, ConcernInput } from "@/types/concern";

export const concernApi = {
  getConcerns: async (): Promise<Concern[]> => {
    const res = await api.get<Concern[]>("/api/v1/concerns");
    return res.data;
  },

  getConcern: async (id: number): Promise<Concern> => {
    const res = await api.get<Concern>(`/api/v1/concerns/${id}`);
    return res.data;
  },

  create: ({ triggerEvent, content }: ConcernInput) =>
    api.post("/api/v1/concerns", {
      concern: { trigger_event: triggerEvent, content },
    }),

  update: (id: number, { triggerEvent, content }: ConcernInput) =>
    api.patch(`/api/v1/concerns/${id}`, {
      concern: { trigger_event: triggerEvent, content },
    }),

  remove: (id: number) => api.delete(`/api/v1/concerns/${id}`),
};
