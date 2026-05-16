'use strict';

// ─── Global Error Handlers ────────────────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const sanitizeHtml = require('sanitize-html');

// Models
const Contact = require('./models/Contact');
const Blog = require('./models/Blog');
const Admin = require('./models/Admin');

// Middleware
const { requireAdmin } = require('./middleware/auth');

const app = express();
const isProd = process.env.NODE_ENV === 'production';
app.set('trust proxy', isProd ? 1 : false);
const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI;
// ─── MongoDB ──────────────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Atlas connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// ─── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                defaultSrc: ["'self'"],

                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://cdn.jsdelivr.net",
                    "https://code.jquery.com",
                    "https://unpkg.com",
                    "https://cdn.quilljs.com"
                ],

                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://cdn.jsdelivr.net",
                    "https://fonts.googleapis.com",
                    "https://cdnjs.cloudflare.com",
                    "https://unpkg.com",
                    "https://cdn.quilljs.com"
                ],

                imgSrc: [
                    "'self'",
                    "data:",
                    "blob:",
                    "https:"
                ],

                fontSrc: [
                    "'self'",
                    "data:",
                    "https://fonts.gstatic.com",
                    "https://cdnjs.cloudflare.com"
                ],

                connectSrc: ["'self'", "https:"],

                objectSrc: ["'none'"],
                frameAncestors: ["'none'"]
            }
        },
        crossOriginEmbedderPolicy: false
    })
);
app.disable('x-powered-by');

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors({
    origin: 'https://codewithaks.in',
    credentials: true
})
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── Session (MongoDB-backed, survives restarts) ──────────────────────────────
const SESSION_SECRET = process.env.SESSION_SECRET;
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        collectionName: 'admin_sessions',
        ttl: 2 * 60 * 60  // 2 hours
    }),
    proxy: true,
    cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 2 * 60 * 60 * 1000  // 2 hours
    }
}));

// ─── View Engine ──────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('strict routing', false);
app.set('case sensitive routing', false);

// ─── Rate Limiters ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many login attempts. Please wait 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false
});

const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});

const uploadPath = path.join(__dirname, 'public/uploads');

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}
// ─── Multer (Image Upload) ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
        const safeName = file.originalname
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9.\-_]/g, '');

        const uniqueName = safeName.toLowerCase();

        cb(null, uniqueName);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        if (!allowed.test(file.mimetype)) return cb(new Error('Only images are allowed'));
        cb(null, true);
    }
});

// ─── Sanitize Helper ──────────────────────────────────────────────────────────
const sanitizeBlogContent = (html) => sanitizeHtml(html, {
    allowedTags: [
        'p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'li', 'img', 'a',
        'article', 'section', 'nav', 'aside', 'header', 'footer',
        'style'
    ],
    allowedAttributes: {
        '*': ['class', 'style', 'id'],
        'a': ['href', 'target'],
        'img': ['src', 'alt']

    },
    allowedSchemes: ['http', 'https', 'data', 'mailto'],

    nonTextTags: ['script', 'noscript', 'textarea'],
    disallowedTagsMode: 'discard'
});

const decodeHtmlEntities = (input = '') => input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');


// ─── Slugify Helper ───────────────────────────────────────────────────────────
function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function categoryToSlug(category = '') {
    return category
        .toLowerCase()
        .trim()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ─── Bot Detection & Global SEO Defaults ──────────────────────────────────────
app.use((req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora\slink\spreview|showyoubot|outbrain|pinterest\/0\.|pinterestbot|slackbot|vkShare|W3C_Validator|lighthouse|chrome-lighthouse/i.test(userAgent);

    res.locals.isBot = isBot;
    res.locals.seo = {
        title: "Ankit Singh - Full Stack Developer",
        description: "Ankit Singh, a Full Stack Developer specializing in React, MERN Stack developer, Node.js & MongoDB. View projects, skills, and blog.",
        keywords: "Ankit Singh, Full Stack Developer, React Developer, Node.js, Portfolio, Blog",
        image: "https://codewithaks.in/images/ankit-singh.webp",
        url: "https://codewithaks.in" + req.originalUrl,
        type: "website",
        robots: isBot ? "index, follow" : "index, follow, max-image-preview:large"
    };
    next();
});

// ─── Force HTTPS & Remove WWW ─────────────────────────────────────────────────
app.use((req, res, next) => {
    if (req.hostname === 'localhost') return next();
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(301, 'https://' + req.headers.host + req.url);
    }
    if (req.headers.host && req.headers.host.startsWith('www.')) {
        return res.redirect(301, 'https://' + req.headers.host.replace('www.', '') + req.url);
    }
    next();
});





// ─── Static Files ─────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Dynamic Sitemap Route ────────────────────────────────────────────────────
app.get("/sitemap.xml", async (req, res) => {
    try {
        res.header('Content-Type', 'application/xml');
        
        const blogs = await Blog.find({ status: 'Published' }).sort({ createdAt: -1 });
        const categories = await Blog.distinct('category', { status: 'Published' });
        
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Homepage -->
  <url>
    <loc>https://codewithaks.in/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Blog Main Page -->
  <url>
    <loc>https://codewithaks.in/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Blog Posts -->
`;
        
        blogs.forEach(blog => {
            const lastmod = blog.updatedAt ? blog.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            xml += `  <url>
    <loc>https://codewithaks.in/blog/${blog.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
        });
        
        xml += `
  <!-- Category Pages -->
`;
        
        categories.filter(Boolean).forEach(category => {
            const categorySlug = categoryToSlug(category);
            xml += `  <url>
    <loc>https://codewithaks.in/blog-categories/${categorySlug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
        });
        
        xml += `
</urlset>`;
        
        res.send(xml);
    } catch (err) {
        console.error("Sitemap generation error:", err);
        res.status(500).send("Error generating sitemap");
    }
});

// ════════════════════════════════════════════════════════════════════════════════
//  PUBLIC ROUTES
// ════════════════════════════════════════════════════════════════════════════════

// Homepage
app.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'Published' }).sort({ createdAt: -1 }).limit(6);
        res.render("index", {
            blogs,
            seo: {
                title: "Ankit Singh – Full Stack Developer Portfolio | CodeWithAKS",
                description: "Explore the portfolio of Ankit Singh – expert full-stack development in React, Node.js & MongoDB. Hire a skilled developer today.",
                keywords: "Ankit Singh portfolio, full stack developer India, React developer, Node.js developer, hire developer",
                image: "https://codewithaks.in/images/ankit-singh.webp",
                url: "https://codewithaks.in/",
                type: "website",
                robots: "index, follow, max-image-preview:large"
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Blog Listing
app.get("/blog", async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'Published' }).sort({ createdAt: -1 });
        res.render("blogs", {
            blogs,
            seo: {
                title: "Tech Blog – Web Dev, AI & SEO Tips | CodeWithAKS",
                description: "Stay updated with latest trends in AI, Web Development, and SEO. Read expert technical guides and tutorials by Ankit Singh.",
                keywords: "tech blog, web development tutorials, AI blog, SEO tips, Node.js tutorials, React guides",
                image: "https://codewithaks.in/images/ankit-singh.webp",
                url: "https://codewithaks.in/blog",
                type: "website",
                robots: "index, follow, max-image-preview:large"
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Blog Category Listing
app.get("/blog-categories/:slug", async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase();
        const allCategories = await Blog.distinct('category', { status: 'Published' });
        const categoryName = allCategories.find((cat) => categoryToSlug(cat) === slug);
        if (!categoryName) {
            return res.status(404).render('404', { message: 'Category not found' });
        }

        const blogs = await Blog.find({
            status: 'Published',
            category: categoryName
        }).sort({ createdAt: -1 });

        res.render("category", {
            blogs,
            categoryName,
            seo: {
                title: `${categoryName} Blogs | CodeWithAKS`,
                description: `Read the latest blogs and articles on ${categoryName} by Ankit Singh.`,
                keywords: `${categoryName.toLowerCase()}, blogs, tutorials, codewithaks`,
                image: "https://codewithaks.in/images/ankit-singh.webp",
                url: `https://codewithaks.in/blog-categories/${req.params.slug}`,
                type: "website",
                robots: "index, follow, max-image-preview:large"
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Single Blog
app.get("/blog/:slug", async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug, status: 'Published' });
        if (!blog) return res.status(404).render('404', { message: 'Blog not found' });

        const [recentBlogs, categoryBlogs, randomBlogs] = await Promise.all([
            Blog.find({ status: 'Published', slug: { $ne: req.params.slug } }).sort({ createdAt: -1 }).limit(5),
            Blog.find({ status: 'Published', category: blog.category, slug: { $ne: req.params.slug } }).sort({ createdAt: -1 }).limit(6),
            Blog.aggregate([{ $match: { status: 'Published', slug: { $ne: req.params.slug } } }, { $sample: { size: 3 } }])
        ]);

        let faqData = [];
        try { faqData = JSON.parse(blog.faqSchema || '[]'); } catch (e) { }

        const breadcrumbData = [
            { name: "Home", url: "https://codewithaks.in/" },
            { name: "Blog", url: "https://codewithaks.in/blog/" },
            { name: blog.title, url: `https://codewithaks.in/blog/${blog.slug}` }
        ];

        // Reading time: avg 200 words/min
        blog.content = sanitizeBlogContent(blog.content);
        const wordCount = blog.content
            .replace(/<[^>]+>/g, '')
            .split(/\s+/)
            .filter(Boolean).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));


        res.render('single_blog', {
            blog,
            faqData,
            breadcrumbData,
            recentBlogs,
            categoryBlogs,
            randomBlogs,
            readingTime,
            seo: {
                title: blog.metaTitle || blog.title,
                description: blog.metaDescription,
                keywords: blog.metaKeywords,
                image: blog.image ? "https://codewithaks.in/uploads/" + blog.image : "https://codewithaks.in/images/ankit-singh.webp",
                url: "https://codewithaks.in/blog/" + blog.slug,
                type: "article",
                robots: "index, follow, max-image-preview:large"
            }
        });
    } catch (err) {
        console.error("SINGLE BLOG ERROR:", err);
        res.status(500).send(err.message);
    }
});

app.get("/privacy-policy", (req, res) => {
    res.render("privacy_policy", {
        seo: {
            title: "Privacy Policy | CodeWithAKS",
            description: "Privacy policy for CodeWithAKS contact and blog platform.",
            keywords: "privacy policy, codewithaks",
            image: "https://codewithaks.in/images/ankit-singh.webp",
            url: "https://codewithaks.in/privacy-policy",
            type: "website",
            robots: "index, follow"
        }
    });
});

// Contact API
app.post('/api/contact', apiLimiter, async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
        }
        const newContact = new Contact({ name, email, phone: phone || '', message });
        await newContact.save();
        res.json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ════════════════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════════════════

// ─── CSRF Protection Middleware ────────────────────────────────────────────────
const csrfProtection = (req, res, next) => {
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    res.locals.csrfToken = req.session.csrfToken;

    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        const token = (req.body && req.body._csrf) || req.headers['csrf-token'] || req.headers['x-csrf-token'];
        if (!token || token !== req.session.csrfToken) {
            // If it's a regular form submission, render error
            const contentType = req.headers['content-type'] || '';
            if (contentType.toLowerCase().includes('application/x-www-form-urlencoded')) {
                return res.status(403).render("dhanrubi/login", {
                    error: 'Session expired. Please login again.',
                    seo: { title: "Admin Login", description: "", robots: "noindex, nofollow" }
                });
            }
            return res.status(403).json({ success: false, message: 'Invalid CSRF token' });
        }
    }
    next();
};

// ─── Admin Global Notifications ───────────────────────────────────────────────
const adminNotifications = async (req, res, next) => {
    try {
        res.locals.unreadContactsCount = await Contact.countDocuments({ isRead: false });
    } catch (err) {
        res.locals.unreadContactsCount = 0;
    }
    next();
};

app.use("/dhanrubi", adminNotifications);

app.get("/dhanrubi", (req, res) => {
    if (req.session && req.session.adminLoggedIn) return res.redirect('/dhanrubi/dashboard');
    res.redirect('/dhanrubi/login');
});

// ── Login Page (GET) ──────────────────────────────────────────────────────────
app.get("/dhanrubi/login", csrfProtection, (req, res) => {
    if (req.session && req.session.adminLoggedIn) return res.redirect('/dhanrubi/dashboard');
    res.render("dhanrubi/login", {
        error: null,
        seo: { title: "Admin Login", description: "", robots: "noindex, nofollow" }
    });
});

// ── Login (POST) — DB-based auth ──────────────────────────────────────────────
app.post("/dhanrubi/login", authLimiter, csrfProtection, [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const loginView = (errorMsg) => res.render("dhanrubi/login", {
        error: errorMsg,
        seo: { title: "Admin Login", description: "", robots: "noindex, nofollow" }
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return loginView(errors.array()[0].msg);

    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
        if (!admin) return loginView("Invalid credentials. Access denied.");

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return loginView("Invalid credentials. Access denied.");

        // Session regenerate to prevent session fixation
        req.session.regenerate((err) => {
            if (err) return loginView("Session error. Please try again.");
            req.session.adminLoggedIn = true;
            req.session.adminUser = admin.username;
            req.session.adminId = admin._id.toString();
            return res.redirect('/dhanrubi/dashboard');
        });
    } catch (err) {
        console.error(err);
        return loginView("Server error. Please try again.");
    }
});

// ── Logout ────────────────────────────────────────────────────────────────────
app.get("/dhanrubi/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/dhanrubi/login');
    });
});

// ── Dashboard ─────────────────────────────────────────────────────────────────
app.get("/dhanrubi/dashboard", requireAdmin, csrfProtection, (req, res) => {
    res.render("dhanrubi/dashboard", {
        adminUser: req.session.adminUser,
        seo: { title: "Admin Dashboard", description: "", robots: "noindex, nofollow" }
    });
});

// ── Blog Manager ──────────────────────────────────────────────────────────────
app.get("/dhanrubi/blogs", requireAdmin, csrfProtection, (req, res) => {
    res.render("dhanrubi/blog", {
        seo: { title: "Manage Blogs", description: "", robots: "noindex, nofollow" }
    });
});

// ── Add / Edit Blog ───────────────────────────────────────────────────────────
app.get("/dhanrubi/add_blog", requireAdmin, csrfProtection, (req, res) => {
    res.render("dhanrubi/add_blog", {
        seo: { title: "Add/Edit Blog", description: "", robots: "noindex, nofollow" }
    });
});

// ── Contacts Manager ──────────────────────────────────────────────────────────
app.get("/dhanrubi/contacts", requireAdmin, csrfProtection, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.render("dhanrubi/contacts", {
            contacts,
            seo: { title: "Contact Messages", description: "", robots: "noindex, nofollow" }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// ── Change Password ───────────────────────────────────────────────────────────
app.get("/dhanrubi/change-password", requireAdmin, csrfProtection, (req, res) => {
    res.render("dhanrubi/change-password", {
        error: null,
        success: null,
        seo: { title: "Change Password", description: "", robots: "noindex, nofollow" }
    });
});

app.post("/dhanrubi/change-password", requireAdmin, csrfProtection, [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required')
], async (req, res) => {
    const renderView = (error, success = null) => res.render("dhanrubi/change-password", {
        error, success,
        seo: { title: "Change Password", description: "", robots: "noindex, nofollow" }
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return renderView(errors.array()[0].msg);

    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) return renderView("New passwords do not match.");

    try {
        const admin = await Admin.findById(req.session.adminId);
        if (!admin) return renderView("Admin not found.");

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) return renderView("Current password is incorrect.");

        admin.password = await bcrypt.hash(newPassword, 12);
        await admin.save();

        return renderView(null, "Password changed successfully!");
    } catch (err) {
        console.error(err);
        return renderView("Server error. Please try again.");
    }
});

// ── Legacy /dhanrubi redirect → 404 ─────────────────────────────────────────────
app.use("/dhanrubi/legacy", (req, res) => res.status(404).render('404', { message: 'Page not found' }));

// ── Contacts count (for dashboard widget) ────────────────────────────────────
app.get("/api/dhanrubi/contacts-count", requireAdmin, async (req, res) => {
    try {
        const count = await Contact.countDocuments();
        const unread = await Contact.countDocuments({ isRead: false });
        res.json({ success: true, count, unread });
    } catch (err) {
        res.json({ success: false, count: 0, unread: 0 });
    }
});

// ════════════════════════════════════════════════════════════════════════════════
//  ADMIN API ROUTES (all protected by requireAdmin)
// ════════════════════════════════════════════════════════════════════════════════

// POST: Add new blog
app.post("/api/dhanrubi/blog/add", requireAdmin, csrfProtection, upload.single('image'), [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
    body('content').trim().notEmpty().withMessage('Content is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ success: false, message: errors.array()[0].msg });

    try {
        let { title, slug, category, tags, status, content, metaTitle, metaKeywords, metaDescription, faqSchema, breadcrumbSchema, ratingValue, ratingCount } = req.body;

        // SLUG-LOCK MECHANISM: Respect provided slug, only auto-generate if missing
        if (!slug || slug.trim() === '') {
            slug = slugify(title);
        }

        const existing = await Blog.findOne({ slug });
        if (existing) {
            // If slug exists, append a short random string to keep it unique but stable
            slug = `${slug}-${crypto.randomBytes(2).toString('hex')}`;
        }

        const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        const cleanContent = sanitizeBlogContent(decodeHtmlEntities(content));

        const blog = new Blog({
            title, slug,
            category: category || 'Uncategorized',
            tags: tagsArray,
            status: status || 'Draft',
            content: cleanContent,
            image: req.file ? req.file.filename : null,
            metaTitle: metaTitle || title,
            metaKeywords: metaKeywords || '',
            metaDescription: metaDescription || '',
            faqSchema: faqSchema || '[]',
            breadcrumbSchema: breadcrumbSchema || '[]',
            ratingValue: parseFloat(ratingValue) || 0,
            ratingCount: parseInt(ratingCount) || 0
        });

        await blog.save();
        res.json({ success: true, message: "Blog published successfully!", slug });
    } catch (err) {
        // console.error("Blog Add Error:", err);
        res.status(500).json({ success: false, message: "Server error: " + err.message });
    }
});

// GET: Admin Blogs (with filtering)
app.get("/api/dhanrubi/blogs", requireAdmin, async (req, res) => {
    try {
        const { search, category, status } = req.query;
        let query = {};

        if (status) query.status = status;
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { slug: { $regex: search, $options: 'i' } }
            ];
        }

        const blogs = await Blog.find(query).sort({ createdAt: -1 });
        const categories = await Blog.distinct('category');
        res.json({ success: true, blogs, categories: categories.filter(Boolean) });
    } catch (err) {
        res.json({ success: false, message: "Server Error" });
    }
});

// GET: Single blog by ID
app.get("/api/dhanrubi/blog/id/:id", requireAdmin, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.json({ success: false, message: "Blog not found" });
        res.json({ success: true, blog });
    } catch (err) {
        res.json({ success: false, message: "Server Error" });
    }
});

// POST: Update blog
app.post("/api/dhanrubi/blog/update/:id", requireAdmin, csrfProtection, upload.single('image'), [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
    body('content').trim().notEmpty().withMessage('Content is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ success: false, message: errors.array()[0].msg });

    try {
        let { title, slug, category, tags, status, content, metaTitle, metaKeywords, metaDescription, faqSchema, breadcrumbSchema, ratingValue, ratingCount } = req.body;

        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.json({ success: false, message: "Blog not found" });

        // SLUG-LOCK: For updates, we NEVER auto-generate slug from title.
        // We only update it if the user explicitly changed the slug field.
        if (!slug || slug.trim() === '') {
            slug = blog.slug; // Fallback to existing
        }

        const existing = await Blog.findOne({ slug, _id: { $ne: req.params.id } });
        if (existing) return res.json({ success: false, message: "This slug is already used by another post." });

        const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        const cleanContent = sanitizeBlogContent(decodeHtmlEntities(content));

        blog.title = title;
        blog.slug = slug;
        blog.category = category || 'Uncategorized';
        blog.tags = tagsArray;
        blog.status = status || 'Draft';
        blog.content = cleanContent;
        blog.metaTitle = metaTitle || title;
        blog.metaKeywords = metaKeywords || '';
        blog.metaDescription = metaDescription || '';
        blog.faqSchema = faqSchema || '[]';
        blog.breadcrumbSchema = breadcrumbSchema || '[]';
        blog.ratingValue = parseFloat(ratingValue) || 0;
        blog.ratingCount = parseInt(ratingCount) || 0;
        if (req.file) blog.image = req.file.filename;

        await blog.save();
        res.json({ success: true, message: "Blog updated successfully!" });
    } catch (err) {
        console.error("Blog Update Error:", err);
        res.status(500).json({ success: false, message: "Server error: " + err.message });
    }
});

// POST: Toggle Publish Status
app.post("/admin/blog/toggle-status/:id", requireAdmin, csrfProtection, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.json({ success: false, message: "Blog not found" });
        blog.status = blog.status === 'Published' ? 'Draft' : 'Published';
        await blog.save();
        res.json({ success: true, newStatus: blog.status.toLowerCase() });
    } catch (err) {
        res.json({ success: false, message: "Server Error" });
    }
});

// DELETE: Delete blog
app.delete("/admin/blog/:id", requireAdmin, csrfProtection, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.json({ success: false, message: "Blog not found" });
        res.json({ success: true, message: "Blog deleted successfully." });
    } catch (err) {
        res.json({ success: false, message: "Server Error" });
    }
});

// ── Contact APIs ──────────────────────────────────────────────────────────────

// DELETE: Delete contact message
app.delete("/admin/contact/:id", requireAdmin, csrfProtection, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Contact deleted." });
    } catch (err) {
        res.json({ success: false, message: "Server Error" });
    }
});

// POST: Mark contact as read
app.post("/admin/contact/read/:id", requireAdmin, csrfProtection, async (req, res) => {
    try {
        await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: "Server Error" });
    }
});




// ─── 404 Catch-all ────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).render('404', { message: 'Page not found' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
