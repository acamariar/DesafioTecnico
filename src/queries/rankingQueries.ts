import type { RankingProducto, RawArticulo, RawVenta } from "../types";

let articulos: RawArticulo[] = [];
let ventas: RawVenta[] = [];

export const loadData = async () => {
  const [artRes, ventasRes] = await Promise.all([
    fetch('/Articulos.csv').then(r => r.text()),
    fetch('/Unidades Vendidas.csv').then(r => r.text())
  ]);

  const { parseCSV } = await import('../utils/csvParser');
  articulos = parseCSV(artRes) as RawArticulo[];
  ventas = parseCSV(ventasRes) as RawVenta[];

};

export const getRankingProductos = async (limit: number = 10): Promise<RankingProducto[]> => {
  const grouped: { [key: string]: { desc: string; total: number } } = {};

  ventas.forEach((venta: RawVenta) => {
    const articulo = articulos.find((a: RawArticulo) => a.ArtCodigo === venta.ArtCodigo);
    const desc = articulo?.Descripcion || 'Desconocido';

    if (!grouped[desc]) {
      grouped[desc] = { desc, total: 0 };
    }
    grouped[desc].total += parseInt(venta.Unidades2) || 0;
  });

  return Object.values(grouped)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
    .map(item => ({
      descripcion: item.desc,
      totalUnidades: item.total
    }));
};