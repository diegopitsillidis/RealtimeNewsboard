import type { Post } from "../../api/posts";

type Props = {
  post: Post;
};

export const PostItem = ({ post }: Props) => {
  const date = new Date(post.createdAt);
  return (
    <article className="border rounded p-3 mb-3 bg-white/5">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-semibold">{post.title}</h2>
        <span className="text-xs px-2 py-1 border rounded">
          {post.category}
        </span>
      </div>
      <p className="text-sm mb-2 whitespace-pre-line">{post.content}</p>
      <div className="text-xs text-gray-500 flex justify-between">
        <span>by {post.author}</span>
        <span>{date.toLocaleString()}</span>
      </div>
    </article>
  );
};
