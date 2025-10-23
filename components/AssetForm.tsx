
import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Asset, AssetCategory, RadioRigAsset } from '../types';
import { RADIO_RIG_JENIS_UNIT } from '../constants';
import { X } from 'lucide-react';

interface AssetFormProps {
    asset: Asset | null;
    category: AssetCategory;
    onClose: () => void;
    onSave: () => void;
}

export const AssetForm: React.FC<AssetFormProps> = ({ asset, category, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Asset>>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (asset) {
            setFormData(asset);
        } else {
            // Default values for a new asset
            setFormData({
                category: category,
                status: 'Aktif',
            });
        }
    }, [asset, category]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (asset) {
                await api.updateAsset(asset.id, formData);
            } else {
                await api.createAsset(formData as Omit<Asset, 'id'>);
            }
            onSave();
        } catch (error) {
            console.error("Failed to save asset", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderRadioRigFields = () => (
        <>
            <InputField name="unit_code" label="Unit Code" value={(formData as Partial<RadioRigAsset>).unit_code} onChange={handleChange} />
            <InputField name="nama_unit" label="Nama Unit" value={(formData as Partial<RadioRigAsset>).nama_unit} onChange={handleChange} />
            <SelectField name="jenis_unit" label="Jenis Unit" value={(formData as Partial<RadioRigAsset>).jenis_unit} onChange={handleChange} options={RADIO_RIG_JENIS_UNIT} />
            <InputField name="model" label="Model" value={formData.model} onChange={handleChange} />
            <InputField name="serial_number" label="Serial Number" value={formData.serial_number} onChange={handleChange} />
            <InputField name="no_asset_acc" label="No Asset Acc" value={(formData as Partial<RadioRigAsset>).no_asset_acc} onChange={handleChange} />
            <InputField name="ur" label="UR" value={(formData as Partial<RadioRigAsset>).ur} onChange={handleChange} />
            <InputField name="po" label="PO" value={(formData as Partial<RadioRigAsset>).po} onChange={handleChange} />
        </>
    );

    const renderStandardFields = () => (
        <>
            <InputField name="model" label="Model" value={formData.model} onChange={handleChange} />
            <InputField name="serial_number" label="Serial Number" value={formData.serial_number} onChange={handleChange} />
            <InputField name="lokasi" label="Lokasi" value={formData.lokasi} onChange={handleChange} />
        </>
    );

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold">{asset ? 'Edit' : 'Tambah'} Aset {category}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <InputField name="nama_aset" label="Nama Aset" value={formData.nama_aset} onChange={handleChange} required />
                    {category === 'Radio RIG' ? renderRadioRigFields() : renderStandardFields()}
                    <SelectField name="status" label="Status" value={formData.status} onChange={handleChange} options={['Aktif', 'Perbaikan', 'Non-Aktif', 'Hilang', 'Rusak', 'Mutasi']} />
                    <InputField type="date" name="tgl_pembelian" label="Tanggal Pembelian" value={formData.tgl_pembelian} onChange={handleChange} />
                    <InputField name="gambar_url" label="URL Gambar" value={formData.gambar_url} onChange={handleChange} placeholder="https://picsum.photos/400/300" />
                    <TextAreaField name="catatan" label="Catatan" value={formData.catatan} onChange={handleChange} />

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Batal</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">{isLoading ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// Helper components for form fields
const InputField: React.FC<{name: string, label: string, value?: string, onChange: React.ChangeEventHandler<HTMLInputElement>, required?: boolean, type?: string, placeholder?: string}> = ({ name, label, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input id={name} name={name} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
    </div>
);

const SelectField: React.FC<{name: string, label: string, value?: string, onChange: React.ChangeEventHandler<HTMLSelectElement>, options: string[], required?: boolean}> = ({ name, label, options, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <select id={name} name={name} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">Pilih...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const TextAreaField: React.FC<{name: string, label: string, value?: string, onChange: React.ChangeEventHandler<HTMLTextAreaElement>}> = ({ name, label, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <textarea id={name} name={name} rows={3} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
    </div>
);

