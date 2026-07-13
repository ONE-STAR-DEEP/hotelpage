export const ROUTES = {
  home: "/",
  search: "/search",
  hotel: (id: string) => `/hotels/${id}` as const,
} as const;
