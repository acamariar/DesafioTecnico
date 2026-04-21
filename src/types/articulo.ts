export type articulo = {
    artCodigo: number;
    descripcion: string;
}
export type RawArticulo = {
    ArtCodigo: string;
    Descripcion: string;
    [key: string]: string; // Para manejar columnas extra si las hubiera
}