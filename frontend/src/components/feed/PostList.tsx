import type { Post } from "../../api/posts";
import { PostItem } from "./PostItem";

type Props = {
  posts: Post[];
};

export const PostList = ({ posts }: Props) => {
  if (posts.length === 0) {
    return <p className="text-sm text-gray-500 mt-2">No posts yet.</p>;
  }

  return (
    <div className="mt-2">
      {posts.map((p) => (
        <PostItem key={p.id} post={p} />
      ))}
    </div>
  );
};
