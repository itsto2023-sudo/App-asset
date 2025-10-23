import { Asset, AssetHistory } from '../types';

const API_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('jwt_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            // Token expired or invalid, log out user
            localStorage.removeItem('jwt_token');
            window.location.href = '/#/login';
        }
        const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    if (response.status === 204) { // No Content
        return null;
    }
    return response.json();
};


// Auth
export const login = async (user: string, pass: string): Promise<{ token: string } | null> => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: user, password: pass })
    });
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('jwt_token', data.token);
        return data;
    }
    return null;
};

export const logout = () => {
    localStorage.removeItem('jwt_token');
};


// Assets
export const getAssets = async (): Promise<Asset[]> => {
    const response = await fetch(`${API_URL}/assets`, { headers: getAuthHeaders() });
    return handleResponse(response);
};

export const getAssetById = async (id: number): Promise<Asset | undefined> => {
    const response = await fetch(`${API_URL}/assets/${id}`, { headers: getAuthHeaders() });
    return handleResponse(response);
};

export const createAsset = async (assetData: Omit<Asset, 'id'>): Promise<Asset> => {
    // Ensure nulls are sent for empty optional fields for the DB
    // FIX: Cast sanitizedData to any to allow setting null for empty strings, which resolves the type error.
    const sanitizedData: any = { ...assetData };
    for (const key in sanitizedData) {
        if (sanitizedData[key] === '') {
            sanitizedData[key] = null;
        }
    }
    const response = await fetch(`${API_URL}/assets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(sanitizedData)
    });
    return handleResponse(response);
};

export const updateAsset = async (id: number, assetData: Partial<Asset>): Promise<Asset | undefined> => {
     // Ensure nulls are sent for empty optional fields for the DB
    // FIX: Cast sanitizedData to any to allow setting null for empty strings, which resolves the type error.
    const sanitizedData: any = { ...assetData };
    for (const key in sanitizedData) {
        if (sanitizedData[key] === '') {
            sanitizedData[key] = null;
        }
    }
    const response = await fetch(`${API_URL}/assets/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(sanitizedData)
    });
    return handleResponse(response);
};

export const deleteAsset = async (id: number): Promise<boolean> => {
    const response = await fetch(`${API_URL}/assets/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    await handleResponse(response);
    return true; // If handleResponse doesn't throw, it was successful
};

export const importAssets = async (importedData: Omit<Asset, 'id'>[]): Promise<{ success: boolean, count: number }> => {
     const response = await fetch(`${API_URL}/assets/import`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(importedData)
    });
    return handleResponse(response);
};


// Asset History
export const getAssetHistory = async (assetId: number): Promise<AssetHistory[]> => {
    const response = await fetch(`${API_URL}/assets/${assetId}/history`, { headers: getAuthHeaders() });
    return handleResponse(response);
};

export const addAssetHistory = async (historyData: Omit<AssetHistory, 'id'>): Promise<AssetHistory> => {
    const response = await fetch(`${API_URL}/assets/${historyData.asset_id}/history`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(historyData)
    });
    return handleResponse(response);
};