
export type AssetCategory = "Radio HT" | "Radio RIG" | "Laptop" | "Printer" | "Komputer" | "Lainnya";

export interface BaseAsset {
    id: number;
    nama_aset: string;
    status: string;
    catatan?: string;
    gambar_url?: string;
    category: AssetCategory;
    tgl_pembelian?: string;
}

export interface RadioRigAsset extends BaseAsset {
    category: "Radio RIG";
    unit_code: string;
    nama_unit: string;
    jenis_unit: string;
    model: string;
    serial_number: string;
    no_asset_acc?: string;
    ur?: string;
    po?: string;
}

export interface StandardAsset extends BaseAsset {
    category: "Radio HT" | "Laptop" | "Printer" | "Komputer" | "Lainnya";
    serial_number?: string;
    model?: string;
    lokasi?: string;
}

export type Asset = RadioRigAsset | StandardAsset;

export interface AssetHistory {
    id: number;
    asset_id: number;
    pengguna: string;
    status: string;
    catatan: string;
    tanggal: string;
}
