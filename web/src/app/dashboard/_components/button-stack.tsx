import CustomButton from '@/components/ui/custom-button';

export default function ButtonStack() {
  return (
    <div className='flex w-full flex-col'>
      <CustomButton
        buttonText='X Connected'
        width='w-1/2'
        className='bg-gradient-to-t from-[#222222] via-[#282B2B] to-[#222222] px-2 py-3 text-[16px] text-white hover:bg-[#222222]'
        icon={
          <svg
            className='h-4 w-4 text-white/60'
            viewBox='0 0 24 24'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M19.7071 6.29289C20.0976 6.68342 20.0976 7.31658 19.7071 7.70711L10.4142 17C9.63316 17.7811 8.36683 17.781 7.58579 17L3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929C3.68342 10.9024 4.31658 10.9024 4.70711 11.2929L9 15.5858L18.2929 6.29289C18.6834 5.90237 19.3166 5.90237 19.7071 6.29289Z'
            />
          </svg>
        }
      />
      <CustomButton
        buttonText='Continue'
        width='w-1/2'
        className='mt-2 bg-gradient-to-t from-[#222222] via-[#282B2B] to-[#222222] px-2 py-3 text-[16px] text-white hover:bg-[#222222]'
        icon={
          <svg
            className='h-4 w-4 text-white/60'
            viewBox='0 0 24 24'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z'
            />
          </svg>
        }
      />
      <CustomButton
        buttonText='Continue'
        className='mt-2 bg-gradient-to-t from-[#222222] via-[#282B2B] to-[#222222] px-2 py-3 text-[16px] text-white hover:bg-[#222222]'
        width='w-1/2'
        icon={
          <svg
            className='h-4 w-4 text-white/60'
            viewBox='0 0 24 24'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z'
            />
          </svg>
        }
      />
    </div>
  );
}
