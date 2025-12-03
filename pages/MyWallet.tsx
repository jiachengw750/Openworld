import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowDownLeft, Copy, ExternalLink, RefreshCw, Send, CheckCircle, AlertCircle, Clock, X, Wallet } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { SendModal } from '../components/modals/SendModal';
import { ReceiveModal } from '../components/modals/ReceiveModal';

const TOKEN_ASSETS = [
    { symbol: 'ETH', name: 'Ethereum', balance: 1.45, price: 2800, icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026' },
    { symbol: 'USDC', name: 'USD Coin', balance: 5430.50, price: 1, icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026' },
];

const NFT_ASSETS = [
    { id: '1', name: 'Genesis Catalyst', collection: 'Catalyst Vouchers', tokenId: '#0012', image: 'https://picsum.photos/400/400?random=100' },
    { id: '2', name: 'Quantum Funder', collection: 'Science POAP', tokenId: '#8821', image: 'https://picsum.photos/400/400?random=101' },
    { id: '3', name: 'BioLab Key', collection: 'Lab Access', tokenId: '#3301', image: 'https://picsum.photos/400/400?random=102' },
];

const MOCK_TRANSACTIONS = Array.from({ length: 25 }).map((_, i) => ({
    id: `tx-${i}`,
    type: i % 3 === 0 ? 'Received' : 'Sent',
    asset: i % 2 === 0 ? 'USDC' : 'ETH',
    amount: (Math.random() * 1000).toFixed(2),
    date: `${i * 2 + 1} hours ago`,
    status: i === 0 ? 'Processing' : i === 4 ? 'Failed' : 'Confirmed',
    hash: `0x${Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16)).join('')}...`
}));

export const MyWallet: React.FC = () => {
    const { wallet } = useWallet();
    const { showToast } = useToast();
    
    const [assetTab, setAssetTab] = useState<'TOKENS' | 'NFTS'>('TOKENS');
    const [selectedNft, setSelectedNft] = useState<typeof NFT_ASSETS[0] | null>(null);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
    const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
    const [isTxRefreshing, setIsTxRefreshing] = useState(false);
    
    const totalBalance = TOKEN_ASSETS.reduce((acc, asset) => acc + (asset.balance * asset.price), 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(amount);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('Copied to clipboard');
    };

    const handleSendSuccess = (amount: string, symbol: string, address: string) => {
        setIsSendModalOpen(false);
        showToast(`Sent ${amount} ${symbol} successfully`);
        
        const newTx = {
            id: `tx-new-${Date.now()}`,
            type: 'Sent',
            asset: symbol,
            amount: amount,
            date: 'Just now',
            status: 'Processing',
            hash: '0xabc...123'
        };
        setTransactions([newTx, ...transactions]);
    };

    const handleRefreshTransactions = () => {
        setIsTxRefreshing(true);
        setTimeout(() => {
            const updated = [...transactions];
            if (updated[0].status === 'Processing') updated[0].status = 'Confirmed';
            setTransactions(updated);
            setIsTxRefreshing(false);
            showToast('Transaction history updated');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-paper pb-24">
            <div className="bg-surface border-b border-ink/10 pt-24 pb-12 px-6 md:px-12">
                <div className="max-w-[1512px] mx-auto">
                    <Link to="/" className="flex items-center text-sm font-mono font-bold text-ink/60 hover:text-ink transition-colors mb-8 uppercase tracking-widest w-fit p-2 -ml-2">
                        <ArrowLeft size={16} className="mr-2" /> Back to Home
                    </Link>
                    <h1 className="font-sans text-5xl md:text-7xl font-bold text-ink mb-4">Wallet</h1>
                    <p className="font-sans text-ink/70 max-w-xl text-xl leading-relaxed">
                        Overview of your digital assets and transaction history.
                    </p>
                </div>
            </div>

            <div className="max-w-[1512px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                <div className="lg:col-span-2 space-y-12">
                    
                    {/* Balance Card - Sharp Edge Style */}
                    <div className="bg-ink text-paper p-10 md:p-12 shadow-2xl rounded-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Wallet size={200} strokeWidth={0.5} />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center space-x-2 mb-6 opacity-60">
                                <span className="text-xs font-mono font-bold uppercase tracking-widest">Total Net Worth</span>
                            </div>
                            
                            <h2 className="font-mono text-5xl md:text-6xl font-bold mb-12 tracking-tight">
                                {formatCurrency(totalBalance)}
                            </h2>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => setIsSendModalOpen(true)}
                                    className="flex-1 bg-paper text-ink hover:bg-white hover:scale-[1.02] transition-all py-4 px-6 font-mono text-sm font-bold uppercase tracking-widest flex items-center justify-center space-x-2 rounded-sm"
                                >
                                    <Send size={16} />
                                    <span>Send</span>
                                </button>
                                <button 
                                    onClick={() => setIsReceiveModalOpen(true)}
                                    className="flex-1 bg-ink border border-paper/20 hover:bg-paper/10 transition-all py-4 px-6 font-mono text-sm font-bold uppercase tracking-widest flex items-center justify-center space-x-2 rounded-sm"
                                >
                                    <ArrowDownLeft size={16} />
                                    <span>Receive</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Transactions Section */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <h3 className="font-sans text-3xl font-bold text-ink">Recent Transactions</h3>
                                <button 
                                    onClick={handleRefreshTransactions} 
                                    className={`p-1.5 rounded-full hover:bg-ink/5 text-ink/40 hover:text-ink transition-colors ${isTxRefreshing ? 'animate-spin' : ''}`}
                                    title="Refresh History"
                                >
                                    <RefreshCw size={14} />
                                </button>
                            </div>
                             <a href="https://etherscan.io/" target="_blank" rel="noreferrer" className="flex items-center text-xs font-mono font-bold text-ink/60 hover:text-accent uppercase tracking-widest border-b border-transparent hover:border-accent transition-all">
                                View All <ExternalLink size={12} className="ml-2"/>
                            </a>
                        </div>

                        <div className="border border-ink/10 bg-paper rounded-none overflow-hidden">
                            {transactions.map((tx, idx) => (
                                <div key={tx.id} className="flex items-center justify-between p-6 border-b border-ink/5 last:border-0 hover:bg-stone/5 transition-colors group">
                                    <div className="flex items-center space-x-6">
                                        <div className={`w-10 h-10 flex items-center justify-center rounded-full border ${
                                            tx.type === 'Received' ? 'bg-green-50 border-green-200 text-green-600' : 
                                            tx.status === 'Failed' ? 'bg-red-50 border-red-200 text-red-600' :
                                            'bg-stone-50 border-ink/10 text-ink'
                                        }`}>
                                            {tx.status === 'Failed' ? <AlertCircle size={18} /> : 
                                             tx.type === 'Received' ? <ArrowDownLeft size={18} /> : 
                                             <Send size={18} />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-ink text-base group-hover:text-accent transition-colors">{tx.type} {tx.asset}</span>
                                            <span className="text-xs font-mono text-ink/40">{tx.date} • {tx.status}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`block font-mono font-bold text-base ${tx.type === 'Received' ? 'text-green-600' : 'text-ink'}`}>
                                            {tx.type === 'Received' ? '+' : '-'}{tx.amount}
                                        </span>
                                        <span className="text-xs font-mono text-ink/30 uppercase tracking-wider">{tx.asset}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Assets */}
                <div className="space-y-12">
                     <div className="bg-surface border-2 border-ink/10 p-8 rounded-none">
                        <div className="flex space-x-8 border-b border-ink/10 mb-8">
                            <button 
                                onClick={() => setAssetTab('TOKENS')}
                                className={`pb-4 text-xs font-mono font-bold uppercase tracking-widest transition-colors relative ${
                                    assetTab === 'TOKENS' ? 'text-ink' : 'text-ink/40 hover:text-ink'
                                }`}
                            >
                                Tokens
                                {assetTab === 'TOKENS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ink"></div>}
                            </button>
                            <button 
                                onClick={() => setAssetTab('NFTS')}
                                className={`pb-4 text-xs font-mono font-bold uppercase tracking-widest transition-colors relative ${
                                    assetTab === 'NFTS' ? 'text-ink' : 'text-ink/40 hover:text-ink'
                                }`}
                            >
                                Collectibles
                                {assetTab === 'NFTS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ink"></div>}
                            </button>
                        </div>

                        {assetTab === 'TOKENS' ? (
                            <div className="space-y-6">
                                {TOKEN_ASSETS.map(asset => (
                                    <div key={asset.symbol} className="flex items-center justify-between group cursor-pointer hover:bg-stone/5 p-2 -mx-2 rounded-sm transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <img src={asset.icon} alt={asset.symbol} className="w-8 h-8 rounded-full bg-white shadow-sm p-0.5" />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-ink text-sm">{asset.name}</span>
                                                <span className="text-xs font-mono text-ink/50">{asset.symbol}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-mono font-bold text-sm text-ink">{asset.balance}</span>
                                            <span className="text-xs font-mono text-ink/40">{formatCurrency(asset.balance * asset.price)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {NFT_ASSETS.map(nft => (
                                    <div 
                                        key={nft.id} 
                                        className="bg-paper border border-ink/10 hover:border-accent transition-colors cursor-pointer group rounded-sm overflow-hidden"
                                        onClick={() => setSelectedNft(nft)}
                                    >
                                        <div className="aspect-square overflow-hidden bg-ink/5">
                                            <img src={nft.image} alt={nft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="p-3">
                                            <span className="block text-[10px] font-mono text-ink/50 uppercase truncate">{nft.collection}</span>
                                            <span className="block font-bold text-ink text-xs truncate">{nft.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                     </div>
                </div>
            </div>

            <SendModal 
                isOpen={isSendModalOpen} 
                onClose={() => setIsSendModalOpen(false)} 
                assets={TOKEN_ASSETS}
                onSendSuccess={handleSendSuccess}
            />

            <ReceiveModal 
                isOpen={isReceiveModalOpen} 
                onClose={() => setIsReceiveModalOpen(false)} 
                address={wallet?.address || ''} 
            />
            
            {/* Simple NFT Modal */}
            {selectedNft && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-paper w-full max-w-sm p-6 relative shadow-2xl animate-in zoom-in-95">
                        <button 
                            onClick={() => setSelectedNft(null)}
                            className="absolute top-4 right-4 p-2 bg-stone/10 hover:bg-stone/20 rounded-full"
                        >
                            <X size={16} />
                        </button>
                        <div className="aspect-square bg-stone/10 mb-6 overflow-hidden">
                            <img src={selectedNft.image} alt={selectedNft.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-xl mb-1">{selectedNft.name}</h3>
                        <p className="font-mono text-sm text-ink/60 mb-6">{selectedNft.collection} • {selectedNft.tokenId}</p>
                        <button className="w-full py-3 bg-ink text-paper font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors">
                            Transfer NFT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
