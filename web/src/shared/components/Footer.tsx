'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import SocialMediaLinks from './social-media-links';

const Footer = () => {
  return (
    <footer className='z-10 mt-8 w-full gap-2.5 px-6 pb-8 pt-4 text-base font-medium md:px-16'>
      <div className='flex flex-col items-start justify-between pb-8 pt-5 text-center text-white/60 lg:flex-row'>
        <div className='flex max-w-lg flex-col justify-start gap-3 text-start'>
          <h1 className='text-2xl font-semibold tracking-[-0.04em] text-white/90'>
            Need help with anything? We&apos;re here!
          </h1>
          <p className='text-lg tracking-[-0.5px]'>
            Just send us a message on WhatsApp and we are here to assist you.
          </p>
        </div>
        <div className='mt-4 flex flex-col marker:text-start lg:mt-0'>
          <div className='flex gap-2 text-sm font-normal text-white/70 md:text-base'>
            <Link
              href='/tos'
              className='border-2-white/70 border-r pr-3 font-semibold text-white/70 transition-colors hover:text-white/70'
            >
              Terms of Service
            </Link>
            <Link
              href='/privacy-policy'
              className='border-2-white/70 border-r pr-3 font-semibold text-white/70 transition-colors hover:text-white/70'
            >
              Privacy Policy
            </Link>
            <Link
              href='/dev-roadmap'
              className='font-semibold text-white/70 transition-colors hover:text-white/70'
            >
              Dev Roadmap
            </Link>
          </div>
        </div>
      </div>
      <div className='mt-8 border-t border-dashed border-white/20 pt-4'>
        {/* mobile view */}
        <div className='flex flex-col gap-6 md:hidden'>
          <div className='mx-auto flex max-w-64 justify-center'>
            <img src='/images/fubuu-icon.svg' alt='logo' className='w-full' />
          </div>
          {/* social media */}
          <div className='mt-6 flex justify-center'>
            <SocialMediaLinks />
          </div>
          <div>
            <p className='mt-6 text-center text-sm font-semibold tracking-[-0.4px] text-white/60'>
              Made by Enzi Studio with love &lt;3
            </p>
          </div>
        </div>
        {/* desktop view */}
        <div className='max-w-screen mx-auto mb-8 mt-6 hidden grid-cols-3 items-center md:grid'>
          <div>
            <p className='flex justify-start text-center text-base font-semibold tracking-[-0.4px] text-white/60'>
              Made by Enzi Studio with love &lt;3
            </p>
          </div>
          <div>
            <img
              src='/images/fubuu-icon.svg'
              alt='logo'
              className='mx-auto flex justify-center'
            />
          </div>
          {/* social media */}
          <div>
            <div className='flex justify-end'>
              <SocialMediaLinks />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
