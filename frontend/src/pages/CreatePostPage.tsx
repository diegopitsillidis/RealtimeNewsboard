import { useMutation } from "@tanstack/react-query";
import { createPost } from "../api/posts";
import { PostForm } from "../components/forms/PostForm";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";

export const CreatePostPage = () => {
  const { token } = useAuthStore();
  const defaultCategory = useSettingsStore((s) => s.defaultCategory);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      navigate("/feed");
    },
  });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>

      <PostForm
        initialCategory={defaultCategory}
        isSubmitting={mutation.isPending}
        error={mutation.isError ? "Failed to create post." : null}
        onSubmit={(values) => mutation.mutate(values)}
      />
    </div>
  );
};
