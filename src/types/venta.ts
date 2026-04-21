export type venta = {
    artCodigo: number;
    Codigo: number;
    unidades: number;
}

export type RawVenta = {
    ArtCodigo: string;
    Codigo: string;
    Unidades2: string;
}

export type RankingProducto = {
    descripcion: string;
    totalUnidades: number;
}
export type RankingFacturacion = {
    descripcion: string;
    facturacion: number;
}