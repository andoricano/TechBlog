export interface ICategory {
    path: string;       // 식별자 및 전체 경로 (예: "tech/report/web")
    slug: string;       // 표시 이름 및 URL 파라미터 (예: "web")
    children: ICategory[]; // 트리 구조를 위한 하위 카테고리 (선택적)
}