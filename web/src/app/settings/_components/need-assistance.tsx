export const NeedAssistance = () => {
  return (
    <div>
      <div className='mx-auto mt-8 flex max-w-3xl flex-col items-center'>
        <p className='mx-16 flex justify-center px-12 text-center text-lg text-white/60'>
          Need assistance with anything?
        </p>
        <p className='mx-16 flex justify-center px-12 text-center text-lg text-white/60'>
          Message us on WhatsApp for a quick response! :)
        </p>
        <button className='mx-auto mt-4 gap-2.5 rounded-2xl bg-white/15 px-4 py-3 text-base text-white/90 transition-colors hover:bg-white/20'>
          🛠️ Contact Support
        </button>
      </div>
    </div>
  );
};
