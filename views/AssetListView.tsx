
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { Asset, AssetCategory, RadioRigAsset } from '../types';
import { RADIO_RIG_JENIS_UNIT } from '../constants';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { AssetForm } from '../components/AssetForm';

export const AssetListView: React.FC = () => {
    const { category } = useParams<{ category: AssetCategory }>();
    const navigate = useNavigate();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [jenisUnitFilter, setJenisUnitFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const allAssets = await api.getAssets();
            setAssets(allAssets);
        } catch (e) {
            setError('Gagal memuat aset.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAssets();
    }, []);

    const filteredAssets = useMemo(() => {
        return assets
            .filter(asset => asset.category === category)
            .filter(asset => {
                if (!searchTerm) return true;
                const search = searchTerm.toLowerCase();
                return (
                    asset.nama_aset.toLowerCase().includes(search) ||
                    ('serial_number' in asset && asset.serial_number?.toLowerCase().includes(search)) ||
                    ('model' in asset && asset.model?.toLowerCase().includes(search))
                );
            })
            .filter(asset => {
                if (category !== 'Radio RIG' || !jenisUnitFilter) return true;
                return (asset as RadioRigAsset).jenis_unit === jenisUnitFilter;
            });
    }, [assets, category, searchTerm, jenisUnitFilter]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus aset ini?')) {
            await api.deleteAsset(id);
            fetchAssets();
        }
    };

    const handleEdit = (asset: Asset) => {
        setEditingAsset(asset);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingAsset(null);
        setIsModalOpen(true);
    };

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{category}</h1>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari aset..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                        <Plus size={20} />
                        <span className="hidden sm:inline">Tambah</span>
                    </button>
                </div>
            </div>

            {category === 'Radio RIG' && (
                <div className="mb-4">
                    <select
                        value={jenisUnitFilter}
                        onChange={e => setJenisUnitFilter(e.target.value)}
                        className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">Semua Jenis Unit</option>
                        {RADIO_RIG_JENIS_UNIT.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nama Aset</th>
                            {category === 'Radio RIG' && <th scope="col" className="px-6 py-3">Jenis Unit</th>}
                            <th scope="col" className="px-6 py-3">Model</th>
                            <th scope="col" className="px-6 py-3">Serial Number</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssets.map(asset => (
                            <tr key={asset.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{asset.nama_aset}</td>
                                {asset.category === 'Radio RIG' && <td className="px-6 py-4">{asset.jenis_unit}</td>}
                                <td className="px-6 py-4">{'model' in asset ? asset.model : '-'}</td>
                                <td className="px-6 py-4">{'serial_number' in asset ? asset.serial_number : '-'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${asset.status === 'Aktif' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                        {asset.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => navigate(`/asset/${asset.id}`)} className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"><Eye size={18} /></button>
                                        <button onClick={() => handleEdit(asset)} className="p-2 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(asset.id)} className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredAssets.length === 0 && <p className="text-center py-8 text-gray-500">Tidak ada aset ditemukan.</p>}
            </div>

            {isModalOpen && (
                <AssetForm
                    asset={editingAsset}
                    category={category!}
                    onClose={() => setIsModalOpen(false)}
                    onSave={() => {
                        setIsModalOpen(false);
                        fetchAssets();
                    }}
                />
            )}
        </div>
    );
};
