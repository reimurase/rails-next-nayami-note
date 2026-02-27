import { api } from "@/lib/api";

export type Roadmap = {
  id: number;
  goal: string;
  content: string;
};

type CreateRoadmapParams = {
  goal: string;
  content: string;
};

type UpdateRoadmapParams = {
  id: number;
  goal: string;
  content: string;
};

type GetRoadmapParams = {
  id: number;
};

type DeleteRoadmapParams = {
  id: number;
};

export const roadmapApi = {
  getRoadmaps: async (): Promise<Roadmap[]> => {
    const res = await api.get<Roadmap[]>("/api/v1/roadmaps");
    return res.data;
  },

  getRoadmap: async ({ id }: GetRoadmapParams): Promise<Roadmap> => {
    const res = await api.get<Roadmap>(`/api/v1/roadmaps/${id}`);
    return res.data;
  },

  create: ({ goal, content }: CreateRoadmapParams) =>
    api.post("/api/v1/roadmaps", {
      roadmap: { goal, content },
    }),

  update: ({ id, goal, content }: UpdateRoadmapParams) =>
    api.patch(`/api/v1/roadmaps/${id}`, {
      roadmap: { goal, content },
    }),

  remove: ({ id }: DeleteRoadmapParams) => api.delete(`/api/v1/roadmaps/${id}`),
};
