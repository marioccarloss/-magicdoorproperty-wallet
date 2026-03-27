import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          const selectedAccount = accounts[0];
          setAccount(selectedAccount);
          fetchBalance(selectedAccount);
          setError('');
        }
      } catch (err) {
        console.error(err);
        setError('Connection failed');
        setAccount('');
        setBalance('');
      }
    } else {
      setError('Please install MetaMask');
    }
  };

  const fetchBalance = async (address) => {
    try {
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      // Convert hex to ether (wei to eth)
      const balanceWei = parseInt(balanceHex, 16);
      const balanceEth = (balanceWei / 1e18).toFixed(4);
      setBalance(balanceEth);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch balance');
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          fetchBalance(accounts[0]);
          setError('');
        } else {
          setAccount('');
          setBalance('');
        }
      };

      const handleDisconnect = () => {
        setAccount('');
        setBalance('');
        setError('');
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, []);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <>
         <section id='hero'>
            <h1>BE OUR GUEST</h1>
            <p>LIVE LIKE A KING IN OUR BEST HOUSES</p>
            
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              {account && balance && (
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px 15px', borderRadius: '5px' }}>
                  {balance} ETH
                </div>
              )}
              
              <button 
                onClick={connectWallet} 
                style={{
                  padding: '12px 24px', 
                  fontSize: '18px', 
                  cursor: 'pointer', 
                  backgroundColor: account ? '#28a745' : '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s'
                }}
              >
                {account ? formatAddress(account) : 'Connect Wallet'}
              </button>
              
              {error && <p style={{ color: '#ff4d4d', fontSize: '14px', margin: 0, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '5px' }}>{error}</p>}
            </div>
         </section>
    </>
  )
}

export default HeroSection;