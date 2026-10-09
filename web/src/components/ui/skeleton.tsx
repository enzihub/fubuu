import { cn } from '@/shared/utils/cn';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-white/15', className)}
      {...props}
    />
  );
}

export { Skeleton };

export function AccountCardSkeleton({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className='my-1 w-full animate-pulse px-5 font-inter'>
      <div className='flex items-center justify-center gap-4'>
        {/* Icon Section Skeleton */}
        <div>
          <div className='flex h-12 w-12 items-center justify-center rounded-full border border-gray-700 bg-white/15 p-1 md:h-16 md:w-16 md:p-1.5'>
            {/* Empty circular skeleton */}
          </div>
        </div>

        {/* Content Section Skeleton */}
        <div className='flex w-full flex-col gap-4'>
          {/* Title Skeleton */}
          <div className='flex flex-col gap-2'>
            <div className='h-7 w-3/4 rounded bg-white/15'></div>
            <div className='h-5 w-full rounded bg-white/15'></div>
            <div className='h-5 w-1/4 rounded bg-white/15'></div>
          </div>

          {/* Children Content Skeleton */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

export function MainCardSketlon() {
  return (
    <>
      <AccountCardSkeleton>
        <div className='flex max-w-xs flex-col gap-2'>
          <div className='h-[44px] w-full rounded-2xl bg-white/15'></div>
          <div className='h-[44px] w-full rounded-2xl bg-white/15'></div>
          <div className='h-[44px] w-full rounded-2xl bg-white/15'></div>
        </div>
      </AccountCardSkeleton>
      <AccountCardSkeleton>
        <div className='flex items-center justify-center gap-2 md:gap-3'>
          <div className='h-[48px] w-full rounded-xl bg-white/15'></div>
          <div className='h-[48px] w-24 rounded-2xl bg-white/15'></div>
        </div>
      </AccountCardSkeleton>
      <AccountCardSkeleton>
      <div className='flex items-center justify-center gap-2 md:gap-3'>
          <div className='h-[48px] w-full rounded-xl bg-white/15'></div>
          <div className='h-[48px] w-24 rounded-2xl bg-white/15'></div>
        </div>
      </AccountCardSkeleton>
      <AccountCardSkeleton>
      <div className='flex items-center justify-center gap-2 md:gap-3'>
          <div className='h-[48px] w-full rounded-xl bg-white/15'></div>
          <div className='h-[48px] w-24 rounded-2xl bg-white/15'></div>
        </div>
      </AccountCardSkeleton>
      <AccountCardSkeleton>
        <div className='h-14 w-full rounded-xl bg-white/15'></div>
      </AccountCardSkeleton>
    </>
  );
}
