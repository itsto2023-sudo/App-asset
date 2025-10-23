
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ASSET_CATEGORIES } from '../constants';
import { Radio, HardDrive, Laptop, Printer, Computer, ChevronRight } from 'lucide-react';
import { AssetCategory } from '../types';

const categoryIcons: { [key in AssetCategory]: React.ReactNode } = {
    "Radio HT": <HardDrive className="w-8 h-8 text-blue-500" />,
    "Radio RIG": <Radio className="w-8 h-8 text-red-500" />,
    "Laptop": <Laptop className="w-8 h-8 text-green-500" />,
    "Printer": <Printer className="w-8 h-8 text-purple-500" />,
    "Komputer": <Computer className="w-8 h-8 text-yellow-500" />,
    "Lainnya": <HardDrive className="w-8 h-8 text-gray-500" />,
};

const DashboardCard: React.FC<{ category: AssetCategory }> = ({ category }) => {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate(`/assets/${category}`)}
            className="group relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg dark:hover:bg-gray-700/50 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
        >
            <div className="absolute -top-4 -right-4 bg-gradient-to-bl from-indigo-100 to-transparent dark:from-indigo-900/50 w-24 h-24 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                        {categoryIcons[category]}
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-100">{category}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola aset {category}</p>
            </div>
        </div>
    );
};

export const DashboardView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ASSET_CATEGORIES.map(category => (
                    <DashboardCard key={category} category={category} />
                ))}
            </div>
        </div>
    );
};
