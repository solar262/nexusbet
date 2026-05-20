"use client";

import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function LobbyClient({ bets }: { bets: any[] }) {
  const [filter, setFilter] = useState('All');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const filteredBets = filter === 'All' ? bets : bets.filter(b => b.type === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ 
        padding: '20px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(8, 10, 15, 0.7)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-primary)', boxShadow: '0 0 15px rgba(0,242,96,0.4)' }}></div>
          <h1 className="heading-font" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '1px' }}>
            NEXUS<span style={{ color: 'var(--accent-neon-green)' }}>BET</span>
          </h1>
        </div>
        
        <nav style={{ display: 'flex', gap: '30px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          <a href="#" style={{ color: 'var(--text-primary)' }}>Lobby</a>
          <a href="#">My Bets</a>
          <a href="#">Leaderboard</a>
          <a href="#">Create Bet</a>
        </nav>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            className="btn btn-outline" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={async () => {
              const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 100, userId: 'demo_user_123' })
              });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>💳</span> Buy USDC (Fiat)
          </button>
          {mounted ? (
            <ConnectButton showBalance={false} />
          ) : (
            <div style={{ 
              height: '42px', 
              width: '150px', 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}></div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '80px 40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(0, 242, 96, 0.1)', color: 'var(--accent-neon-green)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px', border: '1px solid rgba(0,242,96,0.2)' }}>
          Fully Decentralized Escrow
        </div>
        <h2 className="heading-font" style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '20px' }}>
          Bet on Anything. <br/> <span className="text-gradient">Zero Limits.</span>
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6' }}>
          The world's first hybrid P2P betting protocol. Fund your account instantly with Apple Pay, Credit Card, or Crypto. All bets settle trustlessly on-chain.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>Browse Lobby</button>
          <button className="btn btn-outline" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>Create 1v1 Bet</button>
        </div>
      </section>

      {/* Main Lobby */}
      <main style={{ padding: '40px', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h3 className="heading-font" style={{ fontSize: '1.8rem' }}>Live Betting Lobby (Database Connected)</h3>
          
          <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '5px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            {['All', 'POOL', 'ONE_V_ONE'].map(type => (
              <button 
                key={type}
                onClick={() => setFilter(type)}
                style={{ 
                  padding: '8px 20px', 
                  borderRadius: '8px', 
                  background: filter === type ? 'var(--border-highlight)' : 'transparent',
                  color: filter === type ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600
                }}
              >
                {type === 'ONE_V_ONE' ? '1v1' : type}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '25px' }}>
          {filteredBets.map((bet) => (
            <div key={bet.id} className="glass-panel" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: bet.type === 'POOL' ? 'var(--accent-neon-blue)' : 'var(--accent-neon-purple)', fontWeight: 700 }}>
                    {bet.category} • {bet.type === 'ONE_V_ONE' ? '1v1' : 'Pool'}
                  </span>
                  <h4 style={{ fontSize: '1.3rem', marginTop: '8px', lineHeight: '1.4' }}>{bet.title}</h4>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  ⏱ {new Date(bet.closesAt).toLocaleDateString()}
                </div>
              </div>

              {/* Dynamic Content based on Bet Type */}
              {bet.type === 'POOL' ? (
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '15px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>Total Pool</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>$0 (New)</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {bet.options?.map((opt: any) => (
                      <button key={opt.id} className="btn btn-outline" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{opt.label}</span>
                          <span style={{ fontWeight: 700, color: 'var(--accent-neon-green)' }}>--</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '15px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>Maker Stake</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>${bet.makerStake}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>Odds Offered</span>
                    <span style={{ color: 'var(--accent-neon-green)', fontWeight: 700 }}>{bet.takerOdds}x</span>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Accept Bet (Lock ${bet.makerStake})</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
