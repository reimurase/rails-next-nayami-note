import { api } from "@/lib/api/client";
import { RoadmapResponse, Roadmap, RoadmapInput } from "@/types/roadmap";

const toRoadmap = (data: RoadmapResponse): Roadmap => ({
  id: data.id,
  goal: data.goal,
  content: data.content,
  concernId: data.concern_id,
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

  update: (id: number, { goal, content }: RoadmapInput) =>
    api.patch(`/api/v1/roadmaps/${id}`, {
      roadmap: { goal, content },
    }),

  remove: (id: number) => api.delete(`/api/v1/roadmaps/${id}`),
};
