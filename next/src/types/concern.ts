export type Concern = {
  id: number;
  trigger_event: string;
  content: string;
};

export type ConcernInput = {
  triggerEvent: string;
  content: string;
};
