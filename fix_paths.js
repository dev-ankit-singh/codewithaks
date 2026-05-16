const fs = require('fs');
let c = fs.readFileSync('views/index.ejs', 'utf-8');

c = c.replace(/src="\.\/images\//g, 'src="/images/');
c = c.replace(/href="\.\/images\//g, 'href="/images/');
c = c.replace(/src="images\//g, 'src="/images/');
c = c.replace(/href="images\//g, 'href="/images/');

c = c.replace(/href="style\.css"/g, 'href="/style.css"');
c = c.replace(/src="script\.js"/g, 'src="/script.js"');

fs.writeFileSync('views/index.ejs', c);
console.log('Fixed paths manually.');
