import { toIssue } from "./issue";
import { toRoadmap } from "./roadmap";

import { api } from "@/lib/api/client";
import type {
  ConcernResponse,
  Concern,
  ConcernInput,
  ConcernDetailResponse,
  ConcernDetail,
} from "@/types/concern";

const toConcern = (data: ConcernResponse): Concern => ({
  id: data.id,
  triggerEvent: data.trigger_event,
  content: data.content,
  archivedAt: data.archived_at,
  createdAt: data.created_at,
});

const toConcernDetail = (data: ConcernDetailResponse): ConcernDetail => ({
  concern: toConcern(data.concern),
  issue: data.issue ? toIssue(data.issue) : null,
  roadmap: data.roadmap ? toRoadmap(data.roadmap) : null,
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

  getConcern: async (id: number): Promise<ConcernDetail> => {
    const res = await api.get<ConcernDetailResponse>(`/api/v1/concerns/${id}`);
    return toConcernDetail(res.data);
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

  getArchivedConcerns: async (): Promise<Concern[]> => {
    const res = await api.get<ConcernResponse[]>("/api/v1/concerns/archived");
    return res.data.map(toConcern);
  },

  archiveConcern: async (id: number): Promise<void> => {
    await api.patch<ConcernResponse>(`/api/v1/concerns/${id}/archive`);
  },

  unarchiveConcern: async (id: number): Promise<void> => {
    await api.patch<ConcernResponse>(`/api/v1/concerns/${id}/unarchive`);
  },
};
