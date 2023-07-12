import fs from 'fs';
import path from 'path';

const clearFolder = async (fPath) => {
    try {
        if (fs.lstatSync(fPath).isDirectory()) {
            if (fs.existsSync(fPath)) {
                fs.readdirSync(fPath).forEach((file) => {
                    const curPath = path.join(fPath, file);
                    clearFolder(curPath);
                });
                fs.rmdirSync(fPath);
            }
        } else {
            fs.unlinkSync(fPath);
        }
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};

export default clearFolder;
