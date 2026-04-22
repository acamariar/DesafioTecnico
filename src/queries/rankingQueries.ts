import type { RankingProducto, RawArticulo, RawEstacion, RawPrecio, RawVenta } from "../types";
import { parseArticulosCSV } from "../utils/csvParser";

let articulos: RawArticulo[] = [];
let ventas: RawVenta[] = [];
let precios: RawPrecio[] = [];
let estaciones: RawEstacion[] = [];

export const loadData = async () => {
  const [artRes, ventasRes, preciosRes, estacionesRes] = await Promise.all([
    fetch('/Articulos.csv').then(r => r.text()),
    fetch('/Unidades Vendidas.csv').then(r => r.text()),
    fetch('/Precios.csv').then(r => r.text()),
    fetch('/Estaciones.csv').then(r => r.text())
  ]);

  const { parseCSV } = await import('../utils/csvParser');
  articulos = parseArticulosCSV(artRes) as RawArticulo[];
  ventas = parseCSV(ventasRes) as RawVenta[];
  precios = parseCSV(preciosRes) as RawPrecio[];
  estaciones = parseCSV(estacionesRes) as RawEstacion[];

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
export const getRankingFacturacion = async (limit: number = 10) => {
  const grouped: { [key: string]: { desc: string; facturacion: number } } = {};

  ventas.forEach((venta: RawVenta) => {
    const articulo = articulos.find((a) => a.ArtCodigo === venta.ArtCodigo);
    const precio = precios.find((p) => p.ArtCodigo === venta.ArtCodigo);

    const desc = articulo?.Descripcion || 'Desconocido';
    const precioNum = Math.abs(parseFloat(precio?.['Precio Unit. Prom.'] || '0')); // Valor absoluto
    const unidades = parseInt(venta.Unidades2) || 0;
    const facturacion = unidades * precioNum;

    if (!grouped[desc]) {
      grouped[desc] = { desc, facturacion: 0 };
    }
    grouped[desc].facturacion += facturacion;
  });

  return Object.values(grouped)
    .sort((a, b) => b.facturacion - a.facturacion)
    .slice(0, limit)
    .map(item => ({
      descripcion: item.desc,
      facturacion: item.facturacion
    }));
};

export const getTopEstacionesFacturacion = async (limit: number = 3) => {
  const precioMap = new Map(precios.map(p => [p.ArtCodigo, Math.abs(parseFloat(p['Precio Unit. Prom.'])) || 0]));

  const estacionMap = new Map(estaciones.map(e => {
    const [id] = e.Estacion.split(' - ');
    const idNumerico = parseInt(id.trim());
    return [idNumerico, e.Estacion];
  }));

  const stats: Record<number, number> = {};

  ventas.forEach((v) => {
    const precio = precioMap.get(v.ArtCodigo) || 0;
    const facturacion = parseInt(v.Unidades2) * precio;
    const codigoEstacion = parseInt(v.Codigo);

    stats[codigoEstacion] = (stats[codigoEstacion] || 0) + facturacion;
  });

  return Object.entries(stats)
    .map(([codigo, total]) => ({
      nombre: estacionMap.get(Number(codigo)) || "Desconocida",
      facturacion: total
    }))
    .sort((a, b) => b.facturacion - a.facturacion)
    .slice(0, limit);
};

export const getTopEstacionesCombustibles = async (limit: number = 3) => {
  // Identificar combustibles dinámicamente desde articulos
  const combustiblesIds = articulos
    .filter(a => {
      const desc = a.Descripcion.toUpperCase();
      // incluir solo aquellos que contienen NAFTA o DIESEL pero no GNC
      return (desc.includes('NAFTA') || desc.includes('DIESEL')) && !desc.includes('GNC');
    })
    .map(a => a.ArtCodigo);

  const precioMap = new Map(precios.map(p => [p.ArtCodigo, Math.abs(parseFloat(p['Precio Unit. Prom.'])) || 0]));

  const estacionMap = new Map(estaciones.map(e => {
    const [id] = e.Estacion.split(' - ');
    const idNumerico = parseInt(id.trim());
    return [idNumerico, e.Estacion];
  }));

  const stats: Record<number, number> = {};

  ventas.forEach((v) => {
    // Solo procesar si es combustible
    if (!combustiblesIds.includes(v.ArtCodigo)) return;

    const precio = precioMap.get(v.ArtCodigo) || 0;
    const facturacion = parseInt(v.Unidades2) * precio;
    const codigoEstacion = parseInt(v.Codigo);

    stats[codigoEstacion] = (stats[codigoEstacion] || 0) + facturacion;
  });

  return Object.entries(stats)
    .map(([codigo, total]) => ({
      nombre: estacionMap.get(Number(codigo)) || "Desconocida",
      facturacion: total
    }))
    .sort((a, b) => b.facturacion - a.facturacion)
    .slice(0, limit);
};
export const getParticipacionArticulos = async () => {
  const grouped: { [key: string]: { desc: string; facturacion: number } } = {};

  // Solo combustibles: NAFTA o DIESEL, excluyendo GNC
  const combustiblesIds = articulos
    .filter((a) => {
      const desc = a.Descripcion.toUpperCase();
      return (desc.includes('NAFTA') || desc.includes('DIESEL')) && !desc.includes('GNC');
    })
    .map((a) => a.ArtCodigo);

  ventas.forEach((venta: RawVenta) => {
    if (!combustiblesIds.includes(venta.ArtCodigo)) return;

    const articulo = articulos.find((a) => a.ArtCodigo === venta.ArtCodigo);
    const precio = precios.find((p) => p.ArtCodigo === venta.ArtCodigo);

    const desc = articulo?.Descripcion || 'Desconocido';
    const precioNum = Math.abs(parseFloat(precio?.['Precio Unit. Prom.'] || '0'));
    const unidades = parseInt(venta.Unidades2) || 0;
    const facturacion = unidades * precioNum;

    if (!grouped[desc]) {
      grouped[desc] = { desc, facturacion: 0 };
    }

    grouped[desc].facturacion += facturacion;
  });

  return Object.values(grouped)
    .sort((a, b) => b.facturacion - a.facturacion)
    .map((item) => ({
      name: item.desc,
      value: item.facturacion,
    }));
};

export const getParticipacionEstaciones = async () => {
  const precioMap = new Map(
    precios.map((p) => [
      p.ArtCodigo,
      Math.abs(parseFloat(p['Precio Unit. Prom.'])) || 0,
    ])
  );

  const estacionMap = new Map(
    estaciones.map((e) => {
      const [id] = e.Estacion.split(' - ');
      const idNumerico = parseInt(id.trim());
      return [idNumerico, e.Estacion];
    })
  );

  const grouped: Record<number, number> = {};

  ventas.forEach((venta: RawVenta) => {
    const precio = precioMap.get(venta.ArtCodigo) || 0;
    const unidades = parseInt(venta.Unidades2) || 0;
    const facturacion = unidades * precio;
    const codigoEstacion = parseInt(venta.Codigo);

    grouped[codigoEstacion] = (grouped[codigoEstacion] || 0) + facturacion;
  });

  return Object.entries(grouped)
    .map(([codigo, total]) => ({
      name: estacionMap.get(Number(codigo)) || 'Desconocida',
      value: total,
    }))
    .sort((a, b) => b.value - a.value);
};