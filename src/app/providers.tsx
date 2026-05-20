'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from 'wagmi';
// @ts-ignore
import { polygonAmoy, baseSepolia } from 'viem/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// You will need to get a free projectId from https://cloud.walletconnect.com
// We will use a public fallback for development
const config = getDefaultConfig({
  appName: 'NexusBet',
  projectId: 'c0b2b80ebba18b5b5fc0e828d5415c1e', // Standard Dev ID
  chains: [polygonAmoy, baseSepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: 'var(--accent-neon-green)',
          accentColorForeground: '#000000',
          borderRadius: 'medium',
        })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
