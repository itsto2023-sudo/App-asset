
import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import * as api from '../services/api';
import { Asset } from '../types';
import { Upload, Download, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export const ReportsView: React.FC = () => {
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const assets = await api.getAssets();
            const worksheet = XLSX.utils.json_to_sheet(assets);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");
            XLSX.writeFile(workbook, "IT_Assets_Report.xlsx");
        } catch (error) {
            console.error("Failed to export assets", error);
        } finally {
            setIsExporting(false);
        }
    };
    
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleImport(file);
        }
    };

    const handleImport = async (file: File) => {
        setIsImporting(true);
        setImportStatus(null);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet) as Omit<Asset, 'id'>[];
                    
                    const result = await api.importAssets(json);
                    if (result.success) {
                        setImportStatus({ type: 'success', message: `Berhasil mengimpor ${result.count} aset.` });
                    } else {
                        setImportStatus({ type: 'error', message: 'Gagal mengimpor data.' });
                    }
                } catch (err) {
                     setImportStatus({ type: 'error', message: 'Format file tidak valid atau terjadi kesalahan.' });
                } finally {
                    setIsImporting(false);
                }
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            setImportStatus({ type: 'error', message: 'Gagal membaca file.' });
            setIsImporting(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Laporan Aset</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Export Card */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                            <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-semibold">Ekspor ke Excel</h2>
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Unduh semua data aset dalam format file .xlsx.</p>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
                    >
                        {isExporting ? 'Mengekspor...' : 'Ekspor Data'}
                    </button>
                </div>

                {/* Import Card */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                            <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-xl font-semibold">Impor dari Excel</h2>
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Impor data aset dari file .xlsx ke dalam sistem.</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls" className="hidden" />
                    <button
                        onClick={handleImportClick}
                        disabled={isImporting}
                        className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                        {isImporting ? 'Mengimpor...' : 'Impor Data'}
                    </button>
                    {importStatus && (
                         <div className={`mt-4 flex items-center gap-2 p-3 rounded-md text-sm ${importStatus.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                            {importStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                            {importStatus.message}
                        </div>
                    )}
                </div>

                {/* PDF Placeholder Card */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md opacity-60">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">
                            <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-xl font-semibold">Ekspor ke PDF</h2>
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Fitur ini akan segera tersedia.</p>
                    <button
                        disabled
                        className="mt-6 w-full px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
                    >
                        Ekspor PDF
                    </button>
                </div>

            </div>
        </div>
    );
};
