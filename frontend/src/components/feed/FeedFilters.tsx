type Props = {
  category?: string;
  search: string;
  onCategoryChange: (value: string | undefined) => void;
  onSearchChange: (value: string) => void;
};

const categories = ["All", "General", "Sports", "Tech", "Finance"];

export const FeedFilters = ({
  category,
  search,
  onCategoryChange,
  onSearchChange,
}: Props) => {
  return (
    <div className="flex flex-wrap gap-3 items-center mb-4">
      <select
        className="border rounded px-2 py-1"
        value={category ?? "All"}
        onChange={(e) => {
          const val = e.target.value;
          onCategoryChange(val === "All" ? undefined : val);
        }}
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <input
        className="border rounded px-2 py-1 flex-1 min-w-[150px]"
        placeholder="Search by title or content..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
