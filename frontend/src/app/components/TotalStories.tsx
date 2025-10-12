export function TotalStories({ total, counter }: { total: number; counter: number }) {
  if (!total) return null;

  return (
    <div className="w-full flex gap-[2px]">
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className={`flex-1 h-[10px] rounded-sm ${
            counter > index ? "bg-white" : "bg-gray-500"
          }`}
        />
      ))}
    </div>
  );
}
