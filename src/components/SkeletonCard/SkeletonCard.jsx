export default function SkeletonCard() {
  return (
    <div className="bg-white border border-border overflow-hidden">
      <div className="aspect-square shimmer" />
      <div className="p-4 flex flex-col gap-2.5">
        <div className="shimmer h-3 w-2/5 rounded" />
        <div className="shimmer h-3 w-11/12 rounded" />
        <div className="shimmer h-3 w-3/5 rounded" />
        <div className="flex justify-between items-center mt-2">
          <div className="shimmer h-5 w-1/4 rounded" />
          <div className="shimmer h-9 w-2/5 rounded" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }) {
  return <>{Array.from({ length: count }, (_, i) => <SkeletonCard key={i} />)}</>
}
