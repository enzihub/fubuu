export default function AccountCard({
  isRight,
  children,
  title,
  subTitile,
  hideText,
}: {
  isRight?: boolean;
  title: string;
  subTitile: string;
  hideText?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className='w-full px-3 font-inter bg'>
      <div className='flex items-center justify-center gap-4'>
        <div>
          <div className='flex h-12 w-12 items-center justify-center rounded-full border border-[#282B2B] p-1 md:h-16 md:w-16 md:p-1.5'>
            {/* bullet icon */}
            <p>{!isRight ? '❌' : '✅'}</p>
          </div>
        </div>
        <div className='flex w-full flex-col gap-4'>
          {/* text section */}
          {!hideText && (
            <div className='flex flex-col gap-2'>
              <h1 className='traching-[-0.02em] text-[18px] font-semibold text-white md:text-[20px]'>
                {title}
              </h1>
              <p className='traching-[-0.5px] text-[16px] font-medium text-white/60 md:text-[18px]'>
                {subTitile}
              </p>
            </div>
          )}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
