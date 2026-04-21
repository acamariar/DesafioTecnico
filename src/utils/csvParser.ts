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