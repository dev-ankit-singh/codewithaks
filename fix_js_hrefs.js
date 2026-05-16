const fs = require('fs');
const path = require('path');

const viewsAdminDir = path.join(__dirname, 'views', 'admin');
const files = fs.readdirSync(viewsAdminDir);

files.forEach(f => {
    if (f.endsWith('.ejs')) {
        let content = fs.readFileSync(path.join(viewsAdminDir, f), 'utf-8');
        // change things like window.location.href = "/admin/login.html";
        content = content.replace(/window\.location\.href\s*=\s*['"]\/admin\/([a-zA-Z0-9_]+)\.html['"];/g, 'window.location.href = "/admin/$1";');
        fs.writeFileSync(path.join(viewsAdminDir, f), content);
    }
});
console.log('Fixed JS hrefs');
