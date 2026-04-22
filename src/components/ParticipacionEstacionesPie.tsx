import { useEffect } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { useDashboardStore } from '../store/useDashboardStore';


const COLORS = [
    '#22D3EE',
    '#60A5FA',
    '#A78BFA',
    '#F472B6',
    '#F59E0B',
    '#34D399',
    '#F87171',
    '#C084FC',
    '#38BDF8',
    '#FB7185',
    '#FBBF24',
    '#6EE7B7',
    '#F43F5E',
    '#10B981'

];

export const ParticipacionEstacionesPie = () => {
    const data = useDashboardStore((state) => state.rankingParticipacionEstaciones);
    const loading = useDashboardStore((state) => state.isLoadingParticipacionEstaciones);
    const fetchData = useDashboardStore((state) => state.fetchRankingParticipacionEstaciones);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="flex h-95 items-center justify-center text-white">
                Cargando...
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex h-95 items-center justify-center text-white">
                Sin datos
            </div>
        );
    }

    return (
        <div className="w-full sm:h-200 md:h-180">
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={230}
                        paddingAngle={2}
                        label={(entry) => ` ${((entry.value / data.reduce((acc, d) => acc + d.value, 0)) * 100).toFixed(1)}%`}

                    >
                        {data.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>

                    <Tooltip
                        formatter={(value, _name, props) => {
                            const numericValue = Number(value ?? 0);
                            const total = data.reduce((acc, d) => acc + d.value, 0);
                            const percent = ((numericValue / total) * 100).toFixed(1);

                            return [
                                `$${numericValue.toLocaleString('es-AR')} · ${percent}%`,
                                props?.payload?.name ?? '',
                            ];
                        }}
                        contentStyle={{
                            backgroundColor: '#111827',
                            border: '1px solid #374151',
                            borderRadius: '10px',
                            color: '#F9FAFB',
                        }}
                    />

                    <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{
                            color: '#E5E7EB',
                            fontSize: '12px',
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};