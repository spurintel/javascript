'use client';

import React from 'react';
import { MonocleProvider as ReactMonocleProvider } from '@spur.us/monocle-react';
import { NextMonocleProviderProps } from '../types';

export const MonocleProvider = ({
  children,
  publishableKey,
  ...rest
}: NextMonocleProviderProps) => {
  const safePublishableKey =
    publishableKey || process.env.NEXT_PUBLIC_MONOCLE_PUBLISHABLE_KEY || '';

  return (
    <ReactMonocleProvider publishableKey={safePublishableKey} {...rest}>
      {children}
    </ReactMonocleProvider>
  );
};
