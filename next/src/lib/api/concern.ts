import { api } from "@/lib/api/client";
import type {
  ConcernResponse,
  Concern,
  ConcernInput,
  ConcernDetailResponse,
} from "@/types/concern";

const toConcern = (data: ConcernResponse): Concern => ({
  id: data.id,
  triggerEvent: data.trigger_event,
  content: data.content,
});

const toConcernPayload = (input: ConcernInput) => ({
  trigger_event: input.triggerEvent,
  content: input.content,
});

export const concernApi = {
  getConcerns: async (): Promise<Concern[]> => {
    const res = await api.get<ConcernResponse[]>("/api/v1/concerns");
    return res.data.map(toConcern);
  },

  getConcern: async (id: number): Promise<ConcernDetailResponse> => {
    const res = await api.get<ConcernDetailResponse>(`/api/v1/concerns/${id}`);
    return res.data;
  },

  create: async (input: ConcernInput): Promise<Concern> => {
    const res = await api.post<ConcernResponse>("/api/v1/concerns", {
      concern: toConcernPayload(input),
    });
    return toConcern(res.data);
  },

  update: async (id: number, input: ConcernInput): Promise<Concern> => {
    const res = await api.patch<ConcernResponse>(`/api/v1/concerns/${id}`, {
      concern: toConcernPayload(input),
    });
    return toConcern(res.data);
  },

  remove: (id: number) => api.delete(`/api/v1/concerns/${id}`),
};
