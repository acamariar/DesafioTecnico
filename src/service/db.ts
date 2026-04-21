import initSqlJs, { type Database } from 'sql.js';

let dbInstance: Database | null = null;

export const getDB = async (): Promise<Database> => {
    if (dbInstance) return dbInstance;

    try {
        const SQL = await initSqlJs({
            locateFile: (file: string) => {
                // Retorna la ruta correcta del archivo WASM
                if (file.endsWith('.wasm')) {
                    return `https://sql.js.org/dist/${file}`;
                }
                return file;
            }
        });

        dbInstance = new SQL.Database();
        console.log('✅ SQL.js inicializado');
        return dbInstance;
    } catch (error) {
        console.error('❌ Error inicializando SQL.js:', error);
        throw error;
    }
};

export const loadCSVtoSQLite = async (
    db: Database,
    tableName: string,
    csvUrl: string
) => {
    try {
        const response = await fetch(csvUrl);
        const csv = await response.text();

        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',');

        const columnDef = headers.map(h => `${h.trim()} TEXT`).join(', ');
        db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (${columnDef})`);

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => `'${v.trim()}'`).join(', ');
            db.run(`INSERT INTO ${tableName} VALUES (${values})`);
        }

        console.log(`✅ ${tableName} cargado`);
    } catch (error) {
        console.error(`❌ Error ${tableName}:`, error);
        throw error;
    }
};

export const queryDB = (db: Database, sql: string) => {
    try {
        const stmt = db.prepare(sql);
        const result = [];

        while (stmt.step()) {
            const row = stmt.getAsObject();
            result.push(row);
        }

        stmt.free();
        return result;
    } catch (error) {
        console.error('❌ Error query:', error);
        return [];
    }
};