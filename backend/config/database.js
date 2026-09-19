const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const crypto = require('crypto');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function verifyPassword(password, salt, storedHash) {
  try {
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
  } catch (e) {
    return false;
  }
}

const dbPath = path.resolve(__dirname, '../roy_supplier.db');

let db;
try {
  db = new DatabaseSync(dbPath);
  console.log('Connected to SQLite database via native node:sqlite at:', dbPath);
} catch (err) {
  console.error('Error connecting to native SQLite database:', err.message);
}

// Helper wrapper for compatibility
const dbWrapper = {
  all(sql, params = [], callback) {
    try {
      const stmt = db.prepare(sql);
      const rows = stmt.all(...params);
      if (callback) callback(null, rows);
      return rows;
    } catch (err) {
      if (callback) callback(err, null);
      else throw err;
    }
  },

  get(sql, params = [], callback) {
    try {
      const stmt = db.prepare(sql);
      const row = stmt.get(...params);
      if (callback) callback(null, row);
      return row;
    } catch (err) {
      if (callback) callback(err, null);
      else throw err;
    }
  },

  run(sql, params = [], callback) {
    try {
      const stmt = db.prepare(sql);
      const result = stmt.run(...params);
      const context = {
        lastID: Number(result.lastInsertRowid || 0),
        changes: Number(result.changes || 0)
      };
      if (callback) callback.call(context, null);
      return context;
    } catch (err) {
      if (callback) callback.call({}, err);
      else throw err;
    }
  },

  exec(sql) {
    return db.exec(sql);
  }
};

function initDatabase() {
  try {
    db.exec(`PRAGMA foreign_keys = ON;`);

    // 1. Categories Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT
      );
    `);

    // 2. Products Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER,
        name TEXT NOT NULL,
        name_np TEXT,
        description TEXT,
        image TEXT,
        unit TEXT,
        availability TEXT DEFAULT 'In Stock',
        price_range TEXT,
        type TEXT DEFAULT 'material',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `);

    // 3. Services Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        service_type TEXT,
        availability TEXT DEFAULT 'Available',
        capacity TEXT,
        image TEXT,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `);

    // 4. Equipment Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS equipment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        rental_type TEXT DEFAULT 'Hourly / Daily',
        availability TEXT DEFAULT 'Available for Hire',
        specs TEXT
      );
    `);

    // 5. Quote Requests Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS quote_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        product_or_service TEXT NOT NULL,
        category_type TEXT DEFAULT 'General',
        quantity REAL,
        unit TEXT,
        pickup_location TEXT,
        delivery_location TEXT,
        material_type TEXT,
        vehicle_required TEXT,
        required_date TEXT,
        message TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Contacts Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Users Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_quotes_status ON quote_requests(status);`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);

    // Seed default admin account if not present
    try {
      const adminCheck = db.prepare(`SELECT id FROM users WHERE email = ?`).get('ysailendra225@gmail.com');
      if (!adminCheck) {
        const { hash, salt } = hashPassword('admin123');
        const insertAdmin = db.prepare(`
          INSERT INTO users (name, email, phone, password_hash, salt, role)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        insertAdmin.run('RSY Admin', 'ysailendra225@gmail.com', '9827492554', hash, salt, 'admin');
        console.log('Default Admin user initialized: ysailendra225@gmail.com');
      }
    } catch (e) {
      console.error('Error seeding admin user:', e.message);
    }

    // Check & Seed Categories & Products
    const catStmt = db.prepare(`SELECT COUNT(*) AS count FROM categories`);
    const row = catStmt.get();
    if (row && row.count === 0) {
      seedInitialData();
    }
  } catch (err) {
    console.error('Error initializing database tables:', err);
  }
}

function seedInitialData() {
  console.log('Seeding initial construction materials, equipment, and services...');

  const categories = [
    { id: 1, slug: 'construction-materials', name: 'Construction Materials', description: 'Essential building materials including cement, steel, sand, bricks & fittings.' },
    { id: 2, slug: 'transportation', name: 'Transportation & Fleet', description: 'Heavy materials haulage, truck/tractor rentals, and site logistics.' },
    { id: 3, slug: 'bulk-road-materials', name: 'Bulk & Road Materials', description: 'Crusher aggregates, boulders, base course, sub-base & road work supplies.' },
    { id: 4, slug: 'equipment', name: 'Construction Equipment', description: 'Excavators, JCB backhoes, tippers, trucks, and heavy earthmovers.' }
  ];

  const stmtCat = db.prepare(`INSERT INTO categories (id, slug, name, description) VALUES (?, ?, ?, ?)`);
  categories.forEach(c => stmtCat.run(c.id, c.slug, c.name, c.description));

  const products = [
    {
      category_id: 1,
      name: 'OPC & PPC Cement',
      name_np: 'सिमेन्ट (OPC / PPC)',
      description: 'Grade 53 OPC and PPC construction cement suitable for RCC, columns, beams, and plastering.',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
      unit: '50kg Bag / Tonne',
      availability: 'In Stock',
      price_range: 'Market Best Price',
      type: 'material'
    },
    {
      category_id: 1,
      name: 'TMT Steel Rebars (Fe 500D)',
      name_np: 'छड / Rod / TMT Bars',
      description: 'High-strength thermo-mechanically treated steel bars in 8mm, 10mm, 12mm, 16mm, 20mm, 25mm sizes.',
      image: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=800&q=80',
      unit: 'Kg / Tonne',
      availability: 'In Stock',
      price_range: 'Wholesale Rate',
      type: 'material'
    },
    {
      category_id: 1,
      name: 'River Sand',
      name_np: 'बालुवा (Washed River Sand)',
      description: 'Washed double-screened river sand ideal for structural concreting and smooth wall plastering.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      unit: 'Truck Load / cu.ft',
      availability: 'Ready Supply',
      price_range: 'Per Tipper / Truck',
      type: 'material'
    },
    {
      category_id: 1,
      name: 'Crusher Aggregate (Gitti)',
      name_np: 'गिट्टी (Aggregate 10mm / 20mm / 40mm)',
      description: 'Machine-crushed hard blue basalt rock aggregate for high-grade concrete mixes and slab casting.',
      image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
      unit: 'Truck Load / cu.ft',
      availability: 'In Stock',
      price_range: 'Direct Plant Supply',
      type: 'material'
    },
    {
      category_id: 1,
      name: 'Red Clay Bricks & AAC Blocks',
      name_np: 'ईट्टा / Concrete Blocks',
      description: 'First-class kiln fired red clay bricks and lightweight thermal insulating AAC blocks.',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      unit: 'Per 1000 Pcs',
      availability: 'In Stock',
      price_range: 'Competitive',
      type: 'material'
    },
    {
      category_id: 1,
      name: 'Corrugated GI Roofing Sheets',
      name_np: 'जस्तापाता (GI Sheets)',
      description: 'Galvanized iron corrugated roofing sheets in standard gauge thicknesses for homes & warehouses.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      unit: 'Bundle / Sq.ft',
      availability: 'In Stock',
      price_range: 'Factory Outlet',
      type: 'material'
    },
    {
      category_id: 1,
      name: 'HDPE & PVC Plumbing Pipes',
      name_np: 'Pipes & PVC Fittings',
      description: 'Heavy duty pressure PVC, CPVC, and HDPE pipes for water supply, drainage, and irrigation.',
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80',
      unit: 'Meter / Bundle',
      availability: 'In Stock',
      price_range: 'Standard Rate',
      type: 'material'
    },
    {
      category_id: 1,
      name: 'Electrical Conduits & Wires',
      name_np: 'विद्युतीय सामान (Electrical Materials)',
      description: 'Flame retardant copper wiring, PVC conduit pipes, junction boxes, and main switchboards.',
      image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
      unit: 'Roll / Piece',
      availability: 'In Stock',
      price_range: 'Wholesale',
      type: 'material'
    },
    {
      category_id: 1,
      name: 'Exterior & Interior Paint',
      name_np: 'रंगरोगन सामान (Paint & Primer)',
      description: 'Weatherproof exterior wall paint, interior emulsions, wall putty, and water-repellent primer.',
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
      unit: '20L Bucket / Liter',
      availability: 'In Stock',
      price_range: 'Dealer Direct',
      type: 'material'
    },
    {
      category_id: 1,
      name: 'Floor & Wall Tiles',
      name_np: 'टाइल्स (Vitrified & Ceramic)',
      description: 'Anti-skid vitrified floor tiles, decorative kitchen backsplash, and heavy duty parking tiles.',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      unit: 'Box / Sq.ft',
      availability: 'In Stock',
      price_range: 'Factory Rate',
      type: 'material'
    },
    {
      category_id: 1,
      name: 'GI Binding Wire & Wire Mesh',
      name_np: 'GI Wire / Binding Wire',
      description: 'Soft annealed iron binding wire for rebar tying and heavy galvanized chain link fencing.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      unit: 'Kg / Bundle',
      availability: 'In Stock',
      price_range: 'Bulk Price',
      type: 'material'
    },
    {
      category_id: 1,
      name: 'Construction Hand Tools',
      name_np: 'निर्माण औजार (Trowels, Shovels, Hammers)',
      description: 'Masonry trowels, heavy shovels, wheelbarrows, measuring tapes, and safety helmets.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      unit: 'Set / Piece',
      availability: 'In Stock',
      price_range: 'Retail & Wholesale',
      type: 'material'
    },
    {
      category_id: 3,
      name: 'Crusher Dust & Screenings',
      name_np: 'क्रसर डस्ट (Crusher Dust)',
      description: 'Fine stone dust produced during crushing, suitable for paver block bedding and asphalt mix.',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
      unit: 'Tonne / Tipper Load',
      availability: 'Immediate Dispatch',
      price_range: 'Direct Crusher Rate',
      type: 'bulk'
    },
    {
      category_id: 3,
      name: 'Road Base Course Material',
      name_np: 'बेस कोर्स (Base Course Aggregates)',
      description: 'Graded stone aggregates designed for road sub-layer base compaction and highway foundation.',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      unit: 'Cu.Meter / Tipper Load',
      availability: 'Large Volume Stock',
      price_range: 'Contractor Volume Rate',
      type: 'bulk'
    },
    {
      category_id: 3,
      name: 'Road Sub-base Gravel & Soil',
      name_np: 'सब-बेस सामग्री (Sub-Base Gravel)',
      description: 'Sub-base soil gravel matrix for road bed preparation, embankments, and earth fill projects.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      unit: 'Cu.Meter / Fleet Supply',
      availability: 'High Capacity',
      price_range: 'Project Rate',
      type: 'bulk'
    },
    {
      category_id: 3,
      name: 'Quarry Boulders & Retaining Stones',
      name_np: 'ढुङ्गा / Boulder Stones',
      description: 'Heavy quarry boulders for gabion walling, riverbank protection, slope stabilization, and foundation base.',
      image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
      unit: 'Tonne / Truck',
      availability: 'Continuous Supply',
      price_range: 'Quarry Rate',
      type: 'bulk'
    }
  ];

  const stmtProd = db.prepare(`
    INSERT INTO products (category_id, name, name_np, description, image, unit, availability, price_range, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  products.forEach(p => stmtProd.run(p.category_id, p.name, p.name_np, p.description, p.image, p.unit, p.availability, p.price_range, p.type));

  const services = [
    {
      category_id: 2,
      name: 'Construction Material Transportation',
      description: 'End-to-end heavy logistics for transporting steel, cement bags, bricks, and tiles to urban and remote construction sites.',
      service_type: 'Material Haulage',
      availability: '24/7 Dispatch',
      capacity: '5 to 25 Tonnes',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
    },
    {
      category_id: 2,
      name: 'Sand, Aggregate & Soil Haulage',
      description: 'Dedicated tipper truck fleets for fast bulk delivery of river sand, crushed gitti, topsoil, and quarry boulders.',
      service_type: 'Bulk Transport',
      availability: 'Immediate Booking',
      capacity: 'Multi-Tipper Fleet',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80'
    },
    {
      category_id: 2,
      name: 'Cement, Rod & Brick Transportation',
      description: 'Covered flatbed trucks and crane-assisted trucks to unload heavy rebar bundles and delicate brick pallets safely.',
      service_type: 'Heavy Freight',
      availability: 'Daily Service',
      capacity: '10 to 30 Tonnes',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
    },
    {
      category_id: 2,
      name: 'Heavy Truck Rental (6-Wheeler to 14-Wheeler)',
      description: 'Rent commercial heavy duty trucks for inter-city construction material freight and highway supply runs.',
      service_type: 'Truck Rental',
      availability: 'Hourly / Daily / Monthly',
      capacity: 'Up to 35 Tonnes',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
    },
    {
      category_id: 2,
      name: 'Hydraulic Tractor & Trailer Rental',
      description: 'Agile hydraulic tractor trailers engineered for narrow road maneuvering and rural site transport.',
      service_type: 'Tractor Rental',
      availability: 'On Demand',
      capacity: '3 to 7 Tonnes',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    },
    {
      category_id: 2,
      name: 'Pickup Truck Rental (Bolero / Pickup)',
      description: 'Quick local delivery pickup vans for small hardware consignments, tools, and emergency site replenishment.',
      service_type: 'Light Express Delivery',
      availability: 'Instant Dispatch',
      capacity: '1.5 to 3 Tonnes',
      image: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=80'
    },
    {
      category_id: 2,
      name: 'Material Loading & Unloading Labor Team',
      description: 'Experienced labor force equipped with safety gear for fast manual loading/unloading of bricks, bags, and steel.',
      service_type: 'Site Labor Service',
      availability: 'Per Shift / Project',
      capacity: 'Flexible Crew Size',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const stmtServ = db.prepare(`
    INSERT INTO services (category_id, name, description, service_type, availability, capacity, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  services.forEach(s => stmtServ.run(s.category_id, s.name, s.description, s.service_type, s.availability, s.capacity, s.image));

  const equipment = [
    {
      name: 'CAT / Komatsu Excavator (20-Tonne Class)',
      description: 'Heavy duty crawler excavator with hydraulic breaker attachment for rock cutting, deep foundation trenching, and earth excavation.',
      image: 'https://images.unsplash.com/photo-1579412690850-bd41cd0af397?auto=format&fit=crop&w=800&q=80',
      rental_type: 'Hourly / Shift / Monthly Contract',
      availability: 'Ready on Site',
      specs: 'Operating Weight: 21,500 kg | Bucket Capacity: 1.0 m³ | Operator Included'
    },
    {
      name: 'JCB 3CX Backhoe Loader',
      description: 'Versatile 4x4 backhoe loader perfect for site clearing, trench digging, backfilling, and light material handling.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      rental_type: 'Hourly / Daily Rate',
      availability: 'Available Immediately',
      specs: 'Engine: 76 HP | Max Dig Depth: 4.24 m | High Mobility'
    },
    {
      name: '10-Wheeler Heavy Tipper Truck',
      description: 'High capacity hydraulic tipper truck for bulk soil displacement, riverbed sand extraction, and gravel transport.',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
      rental_type: 'Per Trip / Daily Charter',
      availability: 'Available',
      specs: 'Payload: 16 Cu.M / 25 Tonnes | Heavy Duty Suspension'
    },
    {
      name: 'Hydraulic Tractor & Tipping Trailer',
      description: 'Robust 4WD tractor equipped with tipping trailer for hillside transport and tight urban road maneuvering.',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      rental_type: 'Daily / Shift',
      availability: 'Available',
      specs: 'Engine: 50 HP | Trailer Volume: 5 Cu.M | All-Terrain'
    },
    {
      name: 'Heavy Freight Haulage Truck (12-Wheeler)',
      description: 'Long-haul flatbed truck engineered for long distance structural rebar transport, cement bags, and prefabricated concrete beams.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      rental_type: 'Per Trip / Monthly Lease',
      availability: 'Available',
      specs: 'Payload: 30 Tonnes | 28ft Deck Length | GPS Tracked'
    }
  ];

  const stmtEq = db.prepare(`
    INSERT INTO equipment (name, description, image, rental_type, availability, specs)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  equipment.forEach(e => stmtEq.run(e.name, e.description, e.image, e.rental_type, e.availability, e.specs));

  console.log('Database seeding complete!');
}

module.exports = {
  db: dbWrapper,
  initDatabase,
  hashPassword,
  verifyPassword
};
