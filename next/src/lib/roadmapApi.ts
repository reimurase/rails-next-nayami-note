import { api } from "@/lib/api";
import { Roadmap, RoadmapInput } from "@/types/roadmap";

export const roadmapApi = {
  getRoadmaps: async (): Promise<Roadmap[]> => {
    const res = await api.get<Roadmap[]>("/api/v1/roadmaps");
    return res.data;
  },

  getRoadmap: async (id: number): Promise<Roadmap> => {
    const res = await api.get<Roadmap>(`/api/v1/roadmaps/${id}`);
    return res.data;
  },

  create: ({ goal, content }: RoadmapInput) =>
    api.post("/api/v1/roadmaps", {
      roadmap: { goal, content },
    }),

  update: (id: number, { goal, content }: RoadmapInput) =>
    api.patch(`/api/v1/roadmaps/${id}`, {
      roadmap: { goal, content },
    }),

  remove: (id: number) => api.delete(`/api/v1/roadmaps/${id}`),
};
