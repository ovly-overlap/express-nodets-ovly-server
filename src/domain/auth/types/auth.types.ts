// TODO : 현재 사용하지 않음 및 추후 테이블 정규화 후 수정
export type AuthUser = {
    _id: string
    email: string
    name: string
    group: number
    image?: string
}