export default function SidebarSkeleton() {
  return (
    <ul className="space-y-2 animate-pulse">
      {[...Array(6)].map((_, index) => (
        <li
          key={index}
          className="bg-slate-100 rounded-2xl py-3 px-4 h-[42px] w-full"
        >
          <div className="flex items-center gap-x-2">
            <div className="w-5 h-5 bg-slate-300 rounded" />
            <div className="flex-1 h-4 bg-slate-300 rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}
