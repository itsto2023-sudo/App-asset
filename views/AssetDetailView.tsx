
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { Asset, AssetHistory, RadioRigAsset } from '../types';
import { ArrowLeft, Plus } from 'lucide-react';
import { HistoryForm } from '../components/HistoryForm';

export const AssetDetailView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [asset, setAsset] = useState<Asset | null>(null);
    const [history, setHistory] = useState<AssetHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const assetId = parseInt(id || '0', 10);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [assetData, historyData] = await Promise.all([
                api.getAssetById(assetId),
                api.getAssetHistory(assetId)
            ]);
            setAsset(assetData || null);
            setHistory(historyData);
        } catch (error) {
            console.error("Failed to fetch asset details", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (assetId) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetId]);

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (!asset) return <div className="text-center p-8">Aset tidak ditemukan.</div>;
    
    const renderAssetDetails = () => {
        const commonDetails = (
            <>
                <DetailItem label="Status" value={asset.status} />
                <DetailItem label="Catatan" value={asset.catatan} />
                <DetailItem label="Tanggal Pembelian" value={asset.tgl_pembelian} />
            </>
        );

        if (asset.category === 'Radio RIG') {
            const rig = asset as RadioRigAsset;
            return <>
                <DetailItem label="Unit Code" value={rig.unit_code} />
                <DetailItem label="Nama Unit" value={rig.nama_unit} />
                <DetailItem label="Jenis Unit" value={rig.jenis_unit} />
                <DetailItem label="Model" value={rig.model} />
                <DetailItem label="Serial Number" value={rig.serial_number} />
                <DetailItem label="No Asset Acc" value={rig.no_asset_acc} />
                <DetailItem label="UR" value={rig.ur} />
                <DetailItem label="PO" value={rig.po} />
                {commonDetails}
            </>;
        }

        return <>
            {'model' in asset && <DetailItem label="Model" value={asset.model} />}
            {'serial_number' in asset && <DetailItem label="Serial Number" value={asset.serial_number} />}
            {'lokasi' in asset && <DetailItem label="Lokasi" value={asset.lokasi} />}
            {commonDetails}
        </>;
    };

    return (
        <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400 hover:underline">
                <ArrowLeft size={20} />
                Kembali
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{asset.nama_aset}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{asset.category}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    <div className="md:col-span-1">
                        <img src={asset.gambar_url || 'https://picsum.photos/400/300'} alt={asset.nama_aset} className="w-full h-auto object-cover rounded-lg shadow-md" />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {renderAssetDetails()}
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Riwayat Penggunaan</h2>
                    <button onClick={() => setIsHistoryModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                        <Plus size={20} /> Tambah Riwayat
                    </button>
                </div>
                <div className="space-y-4">
                    {history.length > 0 ? history.map(h => (
                        <div key={h.id} className="p-4 border-l-4 border-indigo-500 bg-gray-50 dark:bg-gray-700/50 rounded-r-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{h.pengguna} - <span className="font-normal text-gray-600 dark:text-gray-300">{h.status}</span></p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{h.catatan}</p>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{new Date(h.tanggal).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 dark:text-gray-400">Belum ada riwayat untuk aset ini.</p>
                    )}
                </div>
            </div>
            
            {isHistoryModalOpen && (
                <HistoryForm
                    assetId={asset.id}
                    onClose={() => setIsHistoryModalOpen(false)}
                    onSave={() => {
                        setIsHistoryModalOpen(false);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
};

const DetailItem: React.FC<{label: string, value?: string}> = ({label, value}) => (
    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-gray-800 dark:text-gray-200">{value || '-'}</p>
    </div>
);
