import { getDB } from "../service/db";
import type { RankingProducto } from "../types";


export const getRankingProductos = async (limit: number = 10): Promise<RankingProducto[]> => {
    const db = await getDB();
    const conn = await db.connect();

    // SQL: Unimos Ventas con Articulos, agrupamos por descripción y sumamos
    const result = await conn.query(`
    SELECT 
      a.Descripcion as descripcion,
      SUM(CAST(v.Unidades2 AS INTEGER)) as totalUnidades
    FROM Venta v
    JOIN Articulo a ON v.ArtCodigo = a.ArtCodigo
    GROUP BY a.Descripcion
    ORDER BY totalUnidades DESC
    LIMIT ${limit}
  `);

    await conn.close();

    // Convertimos el resultado a nuestro tipo estricto
    return result.toArray().map((row) => ({
        descripcion: row.descripcion as string,
        totalUnidades: Number(row.totalUnidades)
    }));
};