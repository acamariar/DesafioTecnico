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
    '#22D3EE', // celeste principal
    '#60A5FA', // azul
    '#A78BFA', // violeta
    '#F472B6', // rosado
];

export const ParticipacionCombustiblesPie = () => {
    const data = useDashboardStore((state) => state.rankingParticipacion);
    const loading = useDashboardStore((state) => state.isLoadingParticipacion);
    const fetchData = useDashboardStore((state) => state.fetchRankingParticipacion);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return <div className="text-white">Cargando...</div>;
    }

    return (
        <div className="w-lg h-95">

            <ResponsiveContainer>

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={120}
                        paddingAngle={6}
                        label={({ percent }) => ` ${(percent as number * 100).toFixed(1)}%`}


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
                            fontSize: '13px',
                        }}
                    />
                </PieChart>

            </ResponsiveContainer>
        </div>
    );
};