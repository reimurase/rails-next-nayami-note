import { api } from "@/lib/api/client";
import { RoadmapResponse, Roadmap, RoadmapInput } from "@/types/roadmap";

export const toRoadmap = (data: RoadmapResponse): Roadmap => ({
  id: data.id,
  goal: data.goal,
  content: data.content,
  concernId: data.concern_id,
  archivedAt: data.archived_at,
});

export const roadmapApi = {
  getRoadmaps: async (): Promise<Roadmap[]> => {
    const res = await api.get<RoadmapResponse[]>("/api/v1/roadmaps");
    return res.data.map(toRoadmap);
  },

  create: async (concernId: number, input: RoadmapInput): Promise<Roadmap> => {
    const res = await api.post<RoadmapResponse>(`/api/v1/concerns/${concernId}/roadmap`, {
      roadmap: input,
    });
    return toRoadmap(res.data);
  },

  update: async (concernId: number, input: RoadmapInput): Promise<Roadmap> => {
    const res = await api.patch(`/api/v1/concerns/${concernId}/roadmap`, {
      roadmap: input,
    });
    return toRoadmap(res.data);
  },

  remove: (concernId: number) => api.delete(`/api/v1/concerns/${concernId}/roadmap`),

  getArchivedRoadmaps: async (): Promise<Roadmap[]> => {
    const res = await api.get<RoadmapResponse[]>("/api/v1/roadmaps/archived");
    return res.data.map(toRoadmap);
  },

  archiveRoadmap: async (roadmapId: number): Promise<void> => {
    await api.patch<RoadmapResponse>(`/api/v1/roadmaps/${roadmapId}/archive`);
  },

  unarchiveRoadmap: async (roadmapId: number): Promise<void> => {
    await api.patch<RoadmapResponse>(`/api/v1/roadmaps/${roadmapId}/unarchive`);
  },
};
