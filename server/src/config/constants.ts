export const DB_CONFIG = {
  NAME: "TechblogDB",
  COLLECTION_POSTS: "posts",
  PORT: 7888,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,       // 자원이 성공적으로 생성됨 (글쓰기 성공)
  BAD_REQUEST: 400,   // 요청이 잘못됨 (데이터 누락 등)
  UNAUTHORIZED: 401,  // 권한 없음
  NOT_FOUND: 404,     // 찾을 수 없음
  INTERNAL_SERVER_ERROR: 500, // 서버 내부 오류
} as const;