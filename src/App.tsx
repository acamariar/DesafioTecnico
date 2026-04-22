import { useEffect } from 'react';
import {
  Package, Activity
} from 'lucide-react';
import { useDashboardStore } from './store/useDashboardStore';
import { ParticipacionCombustiblesPie } from './components/ParticipacionArticulosBarChart';
import { ParticipacionEstacionesPie } from './components/ParticipacionEstacionesPie';

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



      <main className="relative z-10 pb-20 max-w-7xl mx-auto">
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

        </div>

        {/* DISEÑO BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* RANKING UNIDADES */}
          <section className="lg:col-span-6 bg-white/3 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-8">
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
          <section className="lg:col-span-6 bg-white/3 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-8">
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
          <section className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda: Gráficos */}
            <div className="flex flex-col gap-6 ">
              <section className="bg-white/3 border border-white/10 backdrop-blur-md rounded-[2.5rem]  p-10 h-full">
                <h3 className='text-xl font-bold flex  gap-3 italic text-white text-center ml-32'>
                  Participación por Artículos</h3>
                <ParticipacionCombustiblesPie />
              </section>

            </div>
            {/* Columna derecha: Top 3 */}
            <div className="flex flex-col gap-6">
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
            </div>

          </section>
          <div className='lg:col-span-12 col-span-1 w-full '>
            <section className="lg:col-span-2 col-span-1 bg-white/3 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-10 ">
              <h3 className='text-xl font-bold flex items-center 
                gap-3 italic text-white text-center mb-10  justify-center w-full'>
                Participación por Estaciones</h3>
              <ParticipacionEstacionesPie />
            </section>
          </div>

        </div>
      </main>
    </div>
  );
};

const TopListCard = ({ title, subtitle, data, variant }: { title: string; subtitle: string; data: { name: string; value: number }[]; variant: 'cyan' | 'orange' }) => {
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