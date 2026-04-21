import { useEffect } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import {
  Package, Activity
} from 'lucide-react';
import { useDashboardStore } from './store/useDashboardStore';
const App = () => {

  const { rankingEstaciones, fetchEstaciones } = useDashboardStore();
  const { rankingCombustibles, fetchTopCombustibles } = useDashboardStore();
  const { rankingFacturacion, isLoadingFacturacion, fetchFacturacion } = useDashboardStore();
  const rankingProductos = useDashboardStore((state) => state.rankingProductos);
  const fetchRanking = useDashboardStore((state) => state.fetchRanking);
  const isLoading = useDashboardStore((state) => state.isLoading);


  useEffect(() => {
    fetchRanking();
    fetchFacturacion();
    fetchEstaciones();
    fetchTopCombustibles();

  }, [fetchRanking, fetchFacturacion, fetchEstaciones, fetchTopCombustibles]);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 font-sans overflow-x-hidden selection:bg-cyan-500/30 p-4 md:p-8">
      {/* DECORACIÓN DE FONDO */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>



      <main className="relative z-10 pb-20 max-w-400 mx-auto">
        {/* SECCIÓN DE ENCABEZADO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-cyan-400 text-xs font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
              <Activity size={14} /> Inteligencia Operativa
            </h2>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
              Dashboard de Ventas
            </h1>
          </div>
          {/* <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl flex gap-10">
            <QuickStat label="Facturación Total" value={`$${(data.totalGlobal / 1000000).toFixed(2)}M`} />
            <div className="w-px h-10 bg-white/10 my-auto" />
            <QuickStat label="Variación Mensual" value="+12.4%" positive />
          </div> */}
        </div>

        {/* DISEÑO BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* RANKING UNIDADES */}
          <section className="lg:col-span-4 bg-white/3 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-bold flex items-center gap-3 italic text-white">
                <Package className="text-cyan-400" /> RANKING UNIDADES
              </h3>
              {isLoading && <div className="text-xs text-cyan-400">Cargando...</div>}
            </div>
            <div className="space-y-4 ">
              {rankingProductos.map((item, i) => (
                <div key={i} className="relative flex items-center justify-between p-5 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 transition-all overflow-hidden group">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-white/5 group-hover:text-cyan-500/20 transition-colors">
                      0{i + 1}
                    </span>

                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                      {item.descripcion}</span>
                  </div>
                  <div className='flex flex-col items-center '>
                    <span>Total Unidades</span>
                    <span className="font-mono text-cyan-400 font-black">{item.totalUnidades.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="lg:col-span-4 bg-white/3 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-bold flex items-center gap-3 italic text-white">
                <Package className="text-cyan-400" /> RANKING FACTURACIÓN
              </h3>
              {isLoadingFacturacion && <div className="text-xs text-cyan-400">Cargando...</div>}
            </div>
            <div className="space-y-4">
              {rankingFacturacion.map((item, i) => (
                <div key={i} className="relative flex items-center justify-between p-5 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 transition-all overflow-hidden group">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-white/5 group-hover:text-cyan-500/20 transition-colors">
                      0{i + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                      {item.descripcion}</span>
                  </div>
                  <div className='flex flex-col items-center '>


                    <span>Total Facturado</span>
                    <span className="font-mono text-cyan-400 font-black">${item.facturacion.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* GRÁFICOS DE PARTICIPACIÓN */}
          <section className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/*   <GlassCard title="Participación Artículos" subtitle="Distribución sobre facturación">
              <PieChartContainer data={data.rankingFacturacion} />
            </GlassCard>

            <GlassCard title="Participación Estaciones" subtitle="Desempeño por punto de venta">
              <PieChartContainer data={data.estacionesFact} />
            </GlassCard>*/}

            <section className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <TopListCard
                title="Top 3 Estaciones"
                subtitle="Mayor facturación total"
                data={rankingEstaciones.map(est => ({
                  name: est.nombre,
                  value: est.facturacion
                }))}
                variant="cyan"
              />
              <TopListCard
                title="Top 3 Combustibles"
                subtitle="Exclusivo Combustibles (Sin GNC)"
                data={rankingCombustibles.map(est => ({
                  name: est.nombre,
                  value: est.facturacion
                }))}
                variant="orange"
              />
            </section>
          </section>

        </div>
      </main>
    </div>
  );
};

// COMPONENTES DE APOYO
const QuickStat = ({ label, value, positive }) => (
  <div className="text-left">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-center gap-2">
      <span className="text-2xl font-black text-white">{value}</span>
      {positive && <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-md">↑</span>}
    </div>
  </div>
);

const GlassCard = ({ title, subtitle, children }) => (
  <div className="bg-white/3 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-8">
    <div className="mb-6">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
    </div>
    <div className="h-62.5 w-full">
      {children}
    </div>
  </div>
);

const PieChartContainer = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%" cy="50%"
        innerRadius={60} outerRadius={85}
        paddingAngle={10}
        dataKey="value"
        stroke="none"
      >
        {data.map((_, i) => <Cell key={i} fill={i === 0 ? '#00f2fe' : `rgba(255,255,255,${0.2 - i * 0.05})`} />)}
      </Pie>
      <Tooltip
        contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
        itemStyle={{ color: '#fff', fontSize: '12px' }}
      />
    </PieChart>
  </ResponsiveContainer>
);

const TopListCard = ({ title, subtitle, data, variant }) => {
  const isCyan = variant === 'cyan';
  return (
    <div className="bg-white/3 border border-white/10 rounded-4xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-md font-bold text-white">{title}</h3>
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">{subtitle}</p>
        </div>

      </div>
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${isCyan ? 'bg-cyan-500 text-black' : 'bg-orange-500 text-black'}`}>
                {i + 1}
              </span>
              <span className="text-sm font-bold text-slate-300">{item.name}</span>
            </div>
            <span className="font-mono text-sm font-black text-white">${item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;