import fs from 'fs';

export const readFile = (filePath, callback) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err);
        }
        try {
            const jsonData = JSON.parse(data);
            callback(null, jsonData);
        } catch (parseError) {
            callback(parseError);
        }
    });
};

export const writeFile = (filePath, data, callback) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
};
