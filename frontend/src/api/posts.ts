import { apiClient } from "./client";

export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string; // ISO string
};

export async function fetchPosts(params: {
  category?: string;
  search?: string;
}) {
  const res = await apiClient.get<Post[]>("/posts", { params });
  return res.data;
}

export async function createPost(data: {
  title: string;
  content: string;
  category: string;
}) {
  const res = await apiClient.post("/posts", data);
  return res.data;
}

