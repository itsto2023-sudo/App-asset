
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { HardDrive } from 'lucide-react';

export const LoginView: React.FC = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const result = await api.login(username, password);
            if (result) {
                login(result.token);
                navigate('/dashboard');
            } else {
                setError('Username atau password salah.');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat login.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl dark:bg-gray-800/50 dark:border dark:border-gray-700 backdrop-blur-lg">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-indigo-100 rounded-full dark:bg-indigo-900/50">
                            <HardDrive className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        IT Asset System
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Masuk untuk melanjutkan
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Username (coba: admin)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Password (coba: password)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
                        >
                            {isLoading ? 'Loading...' : 'Masuk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
