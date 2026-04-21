import * as duckdb from '@duckdb/duckdb-wasm';

let dbInstance: duckdb.AsyncDuckDB | null = null;

export const getDB = async () => {
    if (dbInstance) return dbInstance;

    const bundle = await duckdb.selectBundle({
        mvp: { mainModule: '/duckdb-mvp.wasm', mainWorker: '/duckdb-browser-mvp.worker.js' }
    });

    const worker = new Worker(bundle.mainWorker!);
    const logger = new duckdb.ConsoleLogger();
    const db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule);

    dbInstance = db;
    return dbInstance;
};


export const loadDataToDuckDB = async (
    db: duckdb.AsyncDuckDB,
    tableName: string,
    url: string
) => {

    await db.registerFileURL(
        tableName,
        url,
        duckdb.DuckDBDataProtocol.HTTP,
        false
    );
    const conn = await db.connect();
    await conn.query(`
    CREATE TABLE ${tableName} AS 
    SELECT * FROM read_csv_auto('${tableName}')
  `);

    await conn.close();
};