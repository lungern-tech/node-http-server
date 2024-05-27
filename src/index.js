"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
const root = process.cwd();
app.use(express_1.default.static(root, { dotfiles: "allow" }));
app.set('views', path_1.default.join(__dirname, 'views/'));
app.get('*', (req, res, next) => {
    let filePath = req.path;
    console.log(req.path);
    let target = path_1.default.join(root, filePath);
    let targetStat = fs_1.default.lstatSync(target);
    let last = filePath.split('/').filter(e => !!e).pop() || '/';
    if (targetStat.isDirectory()) {
        const arr = fs_1.default.readdirSync(target);
        console.log(arr);
        let list = arr.map(e => {
            let stat = fs_1.default.statSync(path_1.default.join(target, e));
            return {
                name: e,
                isDirectory: stat.isDirectory(),
                modifiedTime: stat.mtime,
                size: stat.size,
            };
        });
        list.unshift({
            name: "..",
            isDirectory: true,
            modifiedTime: new Date(0),
            size: 0,
        });
        list.unshift({
            name: ".",
            isDirectory: true,
            modifiedTime: new Date(0),
            size: 0
        });
        fs_1.default.statSync(path_1.default.join(target));
        res.render('skeleton', {
            title: last,
            list
        });
        return;
    }
    else if (targetStat.isFile()) {
        console.log('file: ', target);
        res.download(target);
    }
    next();
});
const port = 8080;
app.listen(port, () => {
    console.log('example app listening on port', port);
});
