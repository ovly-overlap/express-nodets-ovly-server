export default interface CursorResponse<T> {
  items: T[];
  nextCursor: number | null;
  hasNext: boolean;
}
