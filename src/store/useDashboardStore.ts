import { create } from 'zustand';
import type { RankingProducto } from '../types';
import { getRankingProductos } from '../queries/rankingQueries';

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
        const data = await getRankingProductos(10); // Traemos el top 10
        set({ rankingProductos: data });
    },
}));