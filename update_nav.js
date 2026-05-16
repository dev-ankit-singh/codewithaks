const fs = require('fs');
const files = ['dashboard.ejs', 'blog.ejs', 'add_blog.ejs', 'contacts.ejs', 'change-password.ejs'];

files.forEach(f => {
    let p = './views/dhanrubi/' + f;
    let content = fs.readFileSync(p, 'utf8');
    
    // Replace inactive link
    content = content.replace(
        /<div class="nav-item"><a href="\/dhanrubi\/contacts"><i class="fa-solid fa-envelope"><\/i> Contacts<\/a><\/div>/g,
        `<div class="nav-item"><a href="/dhanrubi/contacts"><i class="fa-solid fa-envelope"></i> Contacts <% if (locals.unreadContactsCount > 0) { %><span style="background:#ef4444;color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;margin-left:auto;"><%= unreadContactsCount %></span><% } %></a></div>`
    );
    
    // Replace active link
    content = content.replace(
        /<div class="nav-item"><a href="\/dhanrubi\/contacts" class="active"><i class="fa-solid fa-envelope"><\/i> Contacts<\/a><\/div>/g,
        `<div class="nav-item"><a href="/dhanrubi/contacts" class="active"><i class="fa-solid fa-envelope"></i> Contacts <% if (locals.unreadContactsCount > 0) { %><span style="background:#ef4444;color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;margin-left:auto;"><%= unreadContactsCount %></span><% } %></a></div>`
    );
    
    fs.writeFileSync(p, content);
});
console.log('Done');
