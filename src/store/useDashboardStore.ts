import { create } from 'zustand';
import type { rankingEstacionFacturacion, RankingFacturacion, RankingProducto } from '../types';
import { getRankingFacturacion, getRankingProductos, getTopEstacionesCombustibles, getTopEstacionesFacturacion, loadData } from '../queries/rankingQueries';

interface DashboardState {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    isLoadingFacturacion: boolean;
    isLoadingEstaciones: boolean;
    isLoadingCombustibles: boolean;
    rankingProductos: RankingProducto[];
    rankingFacturacion: RankingFacturacion[];
    rankingEstaciones: rankingEstacionFacturacion[];
    rankingCombustibles: rankingEstacionFacturacion[];
    fetchRanking: () => Promise<void>;
    fetchFacturacion: () => Promise<void>;
    fetchEstaciones: () => Promise<void>;
    fetchTopCombustibles: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),
    isLoadingFacturacion: false,
    isLoadingEstaciones: false,
    isLoadingCombustibles: false,
    rankingProductos: [],
    rankingFacturacion: [],
    rankingEstaciones: [],
    rankingCombustibles: [],

    fetchRanking: async () => {
        try {
            await loadData(); // Carga los CSV primero
            const data = await getRankingProductos(10);
            set({ rankingProductos: data });
        } catch (error) {
            console.error('Error:', error);
            set({ isLoading: false });
        }
    },
    fetchFacturacion: async () => {
        set({ isLoadingFacturacion: true });
        try {
            // Aseguramos que los datos estén cargados en memoria
            await loadData();
            const data = await getRankingFacturacion(10);
            console.log('Ranking Facturación:', data);
            set({ rankingFacturacion: data });
        } catch (error) {
            console.error('Error al calcular facturación:', error);
        } finally {
            set({ isLoadingFacturacion: false });
        }
    },
    fetchEstaciones: async () => {
        set({ isLoadingEstaciones: true });
        try {
            await loadData();
            const data = await getTopEstacionesFacturacion(3); // Límite 3
            set({ rankingEstaciones: data });
        } finally {
            set({ isLoadingEstaciones: false });
        }
    },
    fetchTopCombustibles: async () => {
        set({ isLoadingCombustibles: true });
        try {
            const data = await getTopEstacionesCombustibles(3);
            set({ rankingCombustibles: data });
        } catch (error) {
            console.error('Error fetchTopCombustibles:', error);
        } finally {
            set({ isLoadingCombustibles: false });
        }
    },
}));