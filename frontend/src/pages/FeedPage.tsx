import { useState } from "react";
import { FeedFilters } from "../components/feed/FeedFilters";
import { PostList } from "../components/feed/PostList";
import { usePostStream } from "../hooks/usePostStream";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";
import { useSettingsStore } from "../store/settingsStore";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export const FeedPage = () => {
  const { token } = useAuthStore();
  const defaultCategory = useSettingsStore((s) => s.defaultCategory);

  const [category, setCategory] = useState<string | undefined>(
    defaultCategory === "All" ? undefined : defaultCategory
  );
  const [search, setSearch] = useState("");

   const debouncedSearch = useDebouncedValue(search, 300);

  const { posts, isLoading } = usePostStream(category, debouncedSearch);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-3">News Feed</h1>

      <FeedFilters
        category={category}
        search={search}
        onCategoryChange={setCategory}
        onSearchChange={setSearch}
      />

      {isLoading && posts.length === 0 ? (
        <p>Loading posts...</p>
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  );
};
