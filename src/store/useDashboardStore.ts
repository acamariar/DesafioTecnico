import { create } from 'zustand';
import type { RankingProducto } from '../types';
import { getRankingProductos, loadData } from '../queries/rankingQueries';

interface DashboardState {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    rankingProductos: RankingProducto[];
    fetchRanking: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),
    rankingProductos: [],
    fetchRanking: async () => {
        try {
            await loadData(); // Carga los CSV primero
            const data = await getRankingProductos(10);
            set({ rankingProductos: data });
        } catch (error) {
            console.error('Error:', error);
        }
    },
}));