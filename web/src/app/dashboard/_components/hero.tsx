import GlowingCircles from '@/components/ui/glowing-circles';

export default function HeroSection({
  heading,
  subHeading,
  children,
  hideText,
}: {
  children: React.ReactNode;
  heading: string;
  subHeading: string;
  hideText?: boolean;
}) {
  return (
    <div className='relative h-auto min-h-screen w-full bg-[url(/images/bg-img.webp)] bg-cover bg-center bg-no-repeat pb-16 shadow-inner'>
      <GlowingCircles />
      <div className='relative z-10 mx-auto flex items-center justify-center px-8 text-center md:max-w-xl'>
        {!hideText && (
          <div className='space-y-4'>
            <h1 className='glow-text font-gambarino text-5xl text-white md:text-6xl'>
              {heading}
            </h1>
            <p className='font-inter text-xl font-medium tracking-[-0.03em] text-white/70 md:text-2xl'>
              {subHeading}
            </p>
          </div>
        )}
      </div>
      <div className='relative z-10 mt-6 flex items-center justify-center'>
        {children}
      </div>
    </div>
  );
}
