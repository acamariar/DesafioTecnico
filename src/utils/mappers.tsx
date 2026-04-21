import type { articulo, estacion, precio, RawArticulo, RawEstacion, RawPrecio, RawVenta, venta } from "../types";


export const mapArticulo = (raw: RawArticulo): articulo => ({
    artCodigo: Number(raw.ArtCodigo),
    // Unimos todo en caso de que la descripción tenga comas
    descripcion: Object.values(raw).slice(1).join(' ').trim()
});

export const mapEstacion = (raw: RawEstacion): estacion => {
    const [codigo, ...nombre] = raw.Estacion.split(' - ');
    return {
        codigo: Number(codigo),
        nombre: nombre.join(' - ') || 'Sin nombre'
    };
};

export const mapPrecio = (raw: RawPrecio): precio => ({
    artCodigo: Number(raw.ArtCodigo),
    precio: parseFloat(raw['Precio Unit. Prom.'])
});

export const mapVenta = (raw: RawVenta): venta => ({
    artCodigo: Number(raw.ArtCodigo),
    Codigo: Number(raw.Codigo),
    unidades: Number(raw.Unidades2)
});