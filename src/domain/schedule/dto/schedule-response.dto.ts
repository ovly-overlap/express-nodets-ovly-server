export interface ScheduleResponse {
  id: number;
  user_id: number;
  content: string;
  memo: string | null;

  isDone: boolean;
}
