import React, { useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SubmitField({
  onFocus,
  buttonText,
  onChangeInput,
  disableButton,
  placeholder,
  value = '',
  onclickButton,
  errorMessage = '',
  loading = false,
  minHeight = 48,
  maxHeight = 200,
}: {
  onFocus?: () => void;
  buttonText: string;
  placeholder: string;
  onChangeInput?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onclickButton?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  value?: string;
  disableButton?: boolean;
  errorMessage?: string;
  loading?: boolean;
  minHeight?: number;
  maxHeight?: number;
}) {
  // Reference to the textarea element
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Store the full value internally
  const [fullValue, setFullValue] = useState(value);

  // Track focus state
  const [isFocused, setIsFocused] = useState(false);
  
  // Track current screen width
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  // Function to calculate dynamic character limit based on screen width
  const getDynamicCharLimit = (width: number) => {      // Extra small phones
    if (width <= 480) return 15;      // Small phones
    if (width < 640) return 15;      // Large phones
    if (width < 768) return 18;      // Small tablets
    if (width < 1024) return 22;     // Large tablets
    if (width < 1280) return 25;     // Small desktops
    return 30;                       // Large desktops
  };

  // Calculate the display value with dynamic character limit when not focused
  const getDisplayValue = () => {
    if (isFocused) return fullValue;
    
    const limit = getDynamicCharLimit(screenWidth);
    
    return fullValue.length > limit
      ? fullValue.substring(0, limit) + '...'
      : fullValue;
  };

  const displayValue = getDisplayValue();

  // Update internal value when prop changes
  useEffect(() => {
    setFullValue(value);
  }, [value]);

  // Adjust the height of the textarea based on its content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (!fullValue && !isFocused) {
      textarea.style.height = `${minHeight}px`;
      return;
    }

    // Reset the height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    // Calculate the new height (bounded by min and max)
    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight,
    );
    // Set the new height
    textarea.style.height = `${newHeight}px`;
  };

  // Set up event listeners for screen resizing
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      adjustHeight();
    };
    
    // Initial setup
    handleResize();
    
    // Add resize event listener with debounce for performance
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', debouncedResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Adjust height when the display value changes or focus state changes
  useEffect(() => {
    adjustHeight();
  }, [displayValue, isFocused, screenWidth]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update internal full value
    setFullValue(e.target.value);

    // Call the original onChange handler with the full value
    if (onChangeInput) {
      // Create a new event with the full value
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: e.target.value,
        },
      } as React.ChangeEvent<HTMLTextAreaElement>;

      onChangeInput(newEvent);
    }
  };

  // Handle focus events
  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }

    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Calculate responsive container and button classes based on screen width
  const getLayoutClasses = () => {
    // Base container classes
    const containerClasses = "flex items-stretch gap-2 w-full";
    
    // Determine if layout should be vertical or horizontal based on screen width
    const layoutDirection = screenWidth < 640 ? "flex-col" : "flex-row sm:items-center";
    
    // Button width classes
    const buttonWidthClass = screenWidth < 640 ? "w-full" : "w-auto";
    
    return {
      container: `${containerClasses} ${layoutDirection}`,
      button: `h-[52px] ${buttonWidthClass} rounded-2xl bg-[#0059FF] px-3 py-3 text-sm font-medium text-[#FCFCFA] hover:bg-blue-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base whitespace-nowrap`
    };
  };

  const layoutClasses = getLayoutClasses();

  return (
    <div className='w-full'>
      {loading ? (
        <div className='flex w-full flex-col items-center gap-2 sm:flex-row'>
          <Skeleton className='h-[48px] w-full rounded-xl' />
          <Skeleton className='mt-2 h-[48px] w-full rounded-2xl sm:mt-0 sm:w-24' />
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-center gap-2 md:gap-3'>
            <textarea
              ref={textareaRef}
              value={displayValue}
              placeholder={placeholder}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              rows={1}
              style={{
                minHeight: `${minHeight}px`,
                maxHeight: `${maxHeight}px`,
                resize: 'none',
                overflow: fullValue.length > 100 ? 'auto' : 'hidden',
              }}
              className={`block w-full rounded-xl bg-white/10 sm:px-3 px-2 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:border-[#0059FF] focus:ring-[#0059FF] md:text-lg ${
                errorMessage ? 'border border-red-500' : ''
              }`}
            />
            <button
              type='button'
              disabled={disableButton}
              className='h-[48px] w-auto rounded-2xl bg-[#0059FF] px-3 py-3 text-sm font-medium text-[#FCFCFA] hover:bg-blue-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:h-[52px] sm:px-3.5 sm:text-lg'
              onClick={onclickButton}
            >
              {buttonText}
            </button>
          </div>
          {errorMessage && (
            <p className='text-sm text-red-500'>{errorMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
