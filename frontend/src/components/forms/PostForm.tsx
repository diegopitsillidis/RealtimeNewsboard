import { useState } from "react";

type PostFormValues = {
  title: string;
  content: string;
  category: string;
};

type Props = {
  initialCategory?: string;
  isSubmitting: boolean;
  error?: string | null;
  onSubmit: (values: PostFormValues) => void;
};

const categories = ["General", "Sports", "Tech", "Finance"];

export const PostForm = ({
  initialCategory,
  isSubmitting,
  error,
  onSubmit,
}: Props) => {
  const [values, setValues] = useState<PostFormValues>({
    title: "",
    content: "",
    category: initialCategory ?? "General",
  });

  const [touched, setTouched] = useState<{ [K in keyof PostFormValues]?: boolean }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hasErrors = !values.title.trim() || !values.content.trim();
    if (hasErrors) {
      setTouched({ title: true, content: true, category: true });
      return;
    }

    onSubmit({
      title: values.title.trim(),
      content: values.content.trim(),
      category: values.category,
    });
  };

  const titleError =
    touched.title && !values.title.trim() ? "Title is required" : "";
  const contentError =
    touched.content && !values.content.trim() ? "Content is required" : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          className="w-full border rounded px-2 py-1"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {titleError && (
          <p className="text-xs text-red-600 mt-1">{titleError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={5}
          className="w-full border rounded px-2 py-1"
          value={values.content}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {contentError && (
          <p className="text-xs text-red-600 mt-1">{contentError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          name="category"
          className="w-full border rounded px-2 py-1"
          value={values.category}
          onChange={handleChange}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {isSubmitting ? "Creating..." : "Create post"}
      </button>
    </form>
  );
};
