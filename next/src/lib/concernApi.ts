import { api } from "@/lib/api";

type CreateConcernParams = {
  triggerEvent: string;
  content: string;
};

type UpdateConcernParams = {
  id: number;
  triggerEvent: string;
  content: string;
};

export const concernApi = {
  create: ({ triggerEvent, content }: CreateConcernParams) =>
    api.post("/api/v1/concerns", {
      concern: { trigger_event: triggerEvent, content },
    }),

  update: ({ id, triggerEvent, content }: UpdateConcernParams) =>
    api.patch(`/api/v1/concerns/${id}`, {
      concern: { trigger_event: triggerEvent, content },
    }),
};
