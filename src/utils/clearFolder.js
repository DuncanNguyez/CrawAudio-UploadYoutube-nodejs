import fs from 'fs';

const clearFolder = async (path) => {
    try {
        fs.rmSync(path);
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};

export default clearFolder;
