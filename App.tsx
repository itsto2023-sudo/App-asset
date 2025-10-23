
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Sun, Moon, LogOut, LayoutDashboard, HardDrive, Printer, Radio, Laptop, Computer, FileText, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { AssetListView } from './views/AssetListView';
import { DashboardView } from './views/DashboardView';
import { ReportsView } from './views/ReportsView';
import { AssetDetailView } from './views/AssetDetailView';
import { LoginView } from './views/LoginView';
import { useAuth, AuthProvider } from './hooks/useAuth';

// Theme Context
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

const useTheme = () => useContext(ThemeContext);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Layout Components
const SidebarContext = createContext({ expanded: true, setExpanded: (expanded: boolean) => {} });

const Sidebar: React.FC = () => {
    const [expanded, setExpanded] = useState(true);
    
    const SidebarItem: React.FC<{icon: React.ReactNode, text: string, path: string, active?: boolean}> = ({ icon, text, path }) => {
        const { expanded } = useContext(SidebarContext);
        const location = useLocation();
        const navigate = useNavigate();
        const isActive = location.pathname === path;

        return (
            <li
                onClick={() => navigate(path)}
                className={`
                    relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer
                    transition-colors group
                    ${isActive
                        ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800 dark:from-indigo-700 dark:to-indigo-600 dark:text-white"
                        : "hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }
                `}
            >
                {icon}
                <span className={`overflow-hidden transition-all ${expanded ? "w-40 ml-3" : "w-0"}`}>{text}</span>
                {!expanded && (
                    <div className={`
                        absolute left-full rounded-md px-2 py-1 ml-6
                        bg-indigo-100 text-indigo-800 text-sm
                        invisible opacity-20 -translate-x-3 transition-all
                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                        dark:bg-gray-800 dark:text-gray-100
                    `}>
                        {text}
                    </div>
                )}
            </li>
        );
    };

    return (
        <aside className="h-screen sticky top-0">
            <nav className="h-full flex flex-col bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-sm">
                <div className={`p-4 pb-2 flex ${expanded ? 'justify-between' : 'justify-center'} items-center`}>
                    <h1 className={`overflow-hidden transition-all text-2xl font-bold text-indigo-600 dark:text-indigo-400 ${expanded ? "w-32" : "w-0"}`}>IT-AMS</h1>
                    <button onClick={() => setExpanded(curr => !curr)} className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                        {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>
                
                <SidebarContext.Provider value={{ expanded, setExpanded }}>
                    <ul className="flex-1 px-3">
                        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" path="/dashboard" />
                        <SidebarItem icon={<Radio size={20} />} text="Radio RIG" path="/assets/Radio RIG" />
                        <SidebarItem icon={<HardDrive size={20} />} text="Radio HT" path="/assets/Radio HT" />
                        <SidebarItem icon={<Laptop size={20} />} text="Laptop" path="/assets/Laptop" />
                        <SidebarItem icon={<Printer size={20} />} text="Printer" path="/assets/Printer" />
                        <SidebarItem icon={<Computer size={20} />} text="Komputer" path="/assets/Komputer" />
                        <SidebarItem icon={<HardDrive size={20} />} text="Lainnya" path="/assets/Lainnya" />
                        <SidebarItem icon={<FileText size={20} />} text="Laporan" path="/reports" />
                    </ul>
                </SidebarContext.Provider>
                
                <div className="border-t dark:border-gray-700 flex p-3">
                    <img src="https://picsum.photos/40/40" alt="" className="w-10 h-10 rounded-md" />
                    <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-40 ml-3" : "w-0"}`}>
                        <div className="leading-4">
                            <h4 className="font-semibold dark:text-gray-200">Admin</h4>
                            <span className="text-xs text-gray-600 dark:text-gray-400">admin@corp.com</span>
                        </div>
                    </div>
                </div>
            </nav>
        </aside>
    );
};

const Header: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 border-b dark:border-gray-700 flex justify-between items-center sticky top-0 z-10">
            <button onClick={onToggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <Menu size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 lg:block hidden">IT Asset Management</div>
            <div className="flex items-center gap-4">
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <button onClick={handleLogout} className="flex items-center gap-2 p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
            <div className="hidden lg:block">
                <Sidebar />
            </div>
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                    <div onClick={e => e.stopPropagation()}>
                        <Sidebar />
                    </div>
                </div>
            )}
            <div className="flex-1 flex flex-col">
                <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginView />} />
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Routes>
                                        <Route path="/dashboard" element={<DashboardView />} />
                                        <Route path="/assets/:category" element={<AssetListView />} />
                                        <Route path="/asset/:id" element={<AssetDetailView />} />
                                        <Route path="/reports" element={<ReportsView />} />
                                        <Route path="*" element={<Navigate to="/dashboard" />} />
                                    </Routes>
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </ThemeProvider>
    );
}

