export function getTimeAge(createdAt: Date): string {
  const now = Date.now();

  const created = new Date(createdAt).getTime();

  const diff = Math.floor((now - created) / 1000);

  if (diff < 60) {
    return `${diff}초 전`;
  }

  if (diff < 3600) {
    return `${Math.floor(diff / 60)}분 전`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}시간 전`;
  }

  if (diff < 2592000) {
    return `${Math.floor(diff / 86400)}일 전`;
  }

  return `${Math.floor(diff / 2592000)}개월 전`;
}
