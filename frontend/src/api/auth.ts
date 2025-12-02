import { apiClient } from "./client";

export type LoginResponse = {
  token: string;
  username: string;
  role: string;
};

export async function login(username: string, password: string) {
  const res = await apiClient.post<LoginResponse>("/auth/login", {
    username,
    password,
  });
  return res.data;
}
