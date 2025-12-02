import { useEffect, useRef, useState } from "react";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import type { Post } from "../api/posts";
import { fetchPosts } from "../api/posts";

type IncomingPost = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  category: string;
  createdAt: string;
};

export function usePostStream(category?: string, search?: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Keep latest filters for the websocket handler
  const filtersRef = useRef<{ category?: string; search?: string }>({
    category,
    search,
  });

  useEffect(() => {
    filtersRef.current = { category, search };
  }, [category, search]);

  // 1) Fetch posts whenever filters change
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPosts({ category, search });
        if (!cancelled) {
          setPosts(data);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [category, search]);

  // 2) WebSocket for new posts (only set up once)
  useEffect(() => {
    const socket$: WebSocketSubject<IncomingPost> = webSocket({
      url: "wss://localhost:7080/ws/posts",
      deserializer: (e) => JSON.parse(e.data),
    });

    const subscription = socket$.subscribe({
      next: (msg) => {
        const currentFilters = filtersRef.current;
        const searchLower = (currentFilters.search ?? "").toLowerCase();

        if (
          currentFilters.category &&
          msg.category !== currentFilters.category
        ) {
          return;
        }

        if (
          searchLower &&
          !(
            msg.title.toLowerCase().includes(searchLower) ||
            msg.content.toLowerCase().includes(searchLower)
          )
        ) {
          return;
        }

        const post: Post = {
          id: msg.id,
          title: msg.title,
          content: msg.content,
          author: "Someone", // WS payload has authorId only; we keep it simple
          category: msg.category,
          createdAt: msg.createdAt,
        };

        setPosts((prev) => {
          const map = new Map<number, Post>();
          [post, ...prev].forEach((p) => map.set(p.id, p));
          return Array.from(map.values()).sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );
        });
      },
      error: (err) => {
        console.error("WebSocket error", err);
      },
    });

    return () => {
      subscription.unsubscribe();
      socket$.complete();
    };
  }, []);

  return { posts, isLoading };
}
