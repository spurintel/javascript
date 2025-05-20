'use client';

import React from 'react';
import { MonocleProvider as ReactMonocleProvider } from '@spur.us/monocle-react';
import { NextMonocleProviderProps } from '../types';

export const MonocleProvider = ({
  children,
  publishableKey,
  domain,
  ...rest
}: NextMonocleProviderProps) => {
  const safePublishableKey =
    publishableKey || process.env.NEXT_PUBLIC_MONOCLE_PUBLISHABLE_KEY || '';
  const safeDomain =
    domain || process.env.NEXT_PUBLIC_MONOCLE_DOMAIN || undefined;

  return (
    <ReactMonocleProvider
      publishableKey={safePublishableKey}
      domain={safeDomain}
      {...rest}
    >
      {children}
    </ReactMonocleProvider>
  );
};
