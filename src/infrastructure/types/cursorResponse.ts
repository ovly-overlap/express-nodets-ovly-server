export default class CursorResponse<T> {
  items!: T[];
  nextCursor!: number | null;
  hasNext!: boolean;
}
