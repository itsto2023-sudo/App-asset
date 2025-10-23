
import React, { useState } from 'react';
import * as api from '../services/api';
import { AssetHistory } from '../types';
import { X } from 'lucide-react';

interface HistoryFormProps {
    assetId: number;
    onClose: () => void;
    onSave: () => void;
}

export const HistoryForm: React.FC<HistoryFormProps> = ({ assetId, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<AssetHistory, 'id' | 'asset_id'>>({
        pengguna: '',
        status: '',
        catatan: '',
        tanggal: new Date().toISOString().split('T')[0],
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.addAssetHistory({ ...formData, asset_id: assetId });
            onSave();
        } catch (error) {
            console.error("Failed to add history", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Tambah Riwayat</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="pengguna" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pengguna</label>
                        <input id="pengguna" name="pengguna" type="text" value={formData.pengguna} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <input id="status" name="status" type="text" value={formData.status} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal</label>
                        <input id="tanggal" name="tanggal" type="date" value={formData.tanggal} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catatan</label>
                        <textarea id="catatan" name="catatan" rows={3} value={formData.catatan} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Batal</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">{isLoading ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
