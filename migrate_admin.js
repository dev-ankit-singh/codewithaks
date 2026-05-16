const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'admin');
const viewsAdminDir = path.join(__dirname, 'views', 'admin');

if (!fs.existsSync(viewsAdminDir)) fs.mkdirSync(viewsAdminDir);

const files = fs.readdirSync(adminDir);

files.forEach(f => {
    if (f.endsWith('.html')) {
        let content = fs.readFileSync(path.join(adminDir, f), 'utf-8');
        content = content.replace(/\.\/admin_style\.css/g, '/admin/admin_style.css');
        content = content.replace(/href="\/admin\/([a-zA-Z0-9_]+)\.html"/g, 'href="/admin/$1"');
        fs.writeFileSync(path.join(viewsAdminDir, f.replace('.html', '.ejs')), content);
        fs.unlinkSync(path.join(adminDir, f));
    }
});

console.log('Successfully moved and converted admin HTML to EJS');
