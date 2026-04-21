export const parseCSV = (csv: string) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: { [key: string]: string } = {};
        headers.forEach((header, i) => {
            obj[header] = values[i];
        });
        return obj;
    });
};

export const parseArticulosCSV = (csv: string) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map((h) => h.trim());

    return lines.slice(1).map((line) => {
        const cleanLine = line.replace('\r', '').trim();

        const firstCommaIndex = cleanLine.indexOf(',');

        const artCodigo = cleanLine.slice(0, firstCommaIndex).trim();
        const descripcion = cleanLine.slice(firstCommaIndex + 1).trim();

        return {
            [headers[0]]: artCodigo,
            [headers[1]]: descripcion,
        };
    });
};