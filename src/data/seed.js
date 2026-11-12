export const CATEGORIES = [
  { name: 'Audio', code: 'AUD', icon: 'headphones' },
  { name: 'Accesorios', code: 'ACC', icon: 'keyboard' },
  { name: 'Pantallas', code: 'PAN', icon: 'monitor' },
  { name: 'Cables', code: 'CAB', icon: 'cable-data' },
  { name: 'Almacenamiento', code: 'ALM', icon: 'harddisk' },
  { name: 'Energía', code: 'ENE', icon: 'battery-charging' },
  { name: 'Oficina', code: 'OFI', icon: 'printer' },
  { name: 'Redes', code: 'RED', icon: 'router-wireless' },
];

export const CURRENT_USER = {
  name: 'Ana García',
  email: 'ana.garcia@inventoryflow.com',
  role: 'Administradora',
  warehouse: 'Almacén central',
};

export const DEMO_CREDENTIALS = {
  email: 'ana.garcia@inventoryflow.com',
  password: 'admin123',
};

const PRODUCT_NAMES = {
  Audio: [
    'Auriculares Pro X',
    'Bocina Bluetooth Mini',
    'Barra de sonido Studio',
    'Audífonos deportivos',
    'Micrófono USB Podcast',
    'Bocina portátil Rugged',
    'Auriculares Studio Pro',
    'Subwoofer compacto',
    'Amplificador 2.0',
    'Audífonos gaming',
    'Bocina inteligente',
    'Micrófono de solapa',
    'Receptor Bluetooth',
    'Tarjeta de sonido',
    'Interfaz de audio',
    'Kit de podcasts',
  ],
  Accesorios: [
    'Teclado inalámbrico',
    'Mouse ergonómico',
    'Teclado mecánico 60%',
    'Mouse inalámbrico Slim',
    'Reposamuñecas',
    'Hub USB-C 7 en 1',
    'Adaptador HDMI',
    'Base para laptop',
    'Soporte para monitor',
    'Funda para tablet',
    'Lápiz digital',
    'Teclado numérico',
    'Mousepad XL',
    'Organizador de cables de escritorio',
    'Adaptador USB-A a USB-C',
    'Kit de limpieza tech',
  ],
  Pantallas: [
    'Monitor 24 pulgadas',
    'Monitor 27 QHD',
    'Monitor ultrawide 34',
    'Pantalla portátil 15',
    'Monitor gaming 165 Hz',
    'Monitor 4K 27',
    'Pantalla táctil 15',
    'Monitor curvo 32',
    'Televisor 43 4K',
    'Televisor 55 4K',
    'Proyector portátil',
    'Pantalla de proyección',
    'Monitor vertical 24',
    'Monitor 22 oficina',
    'Pantalla LED 32',
    'Soporte de pared TV',
  ],
  Cables: [
    'Cable USB-C 1 m',
    'Cable HDMI 2 m',
    'Cable Lightning 1 m',
    'Cable USB-C 2 m',
    'Cable DisplayPort 2 m',
    'Cable de red Cat 6 3 m',
    'Cable de red Cat 6 5 m',
    'Cable USB-A 1.5 m',
    'Cable de alimentación 1.8 m',
    'Cable AUX 1 m',
    'Cable VGA 1.8 m',
    'Cable USB-C trenzado',
    'Extensión USB 2 m',
    'Adaptador USB-C a HDMI',
    'Cable de audio óptico',
    'Organizador de cables magnético',
  ],
  Almacenamiento: [
    'SSD 500 GB',
    'SSD 1 TB',
    'SSD NVMe 1 TB',
    'HDD externo 2 TB',
    'HDD externo 4 TB',
    'Memoria USB 64 GB',
    'Memoria USB 128 GB',
    'Tarjeta microSD 128 GB',
    'Tarjeta microSD 256 GB',
    'Hub de almacenamiento',
    'Caja para HDD',
    'Docking station SSD',
    'NAS 2 bahías',
    'SSD portátil 1 TB',
    'Memoria USB 32 GB',
    'Lector de tarjetas',
  ],
  Energía: [
    'Batería externa 10 000 mAh',
    'Batería externa 20 000 mAh',
    'Cargador USB-C 65 W',
    'Cargador USB-C 30 W',
    'Cargador inalámbrico',
    'Base de carga 3 en 1',
    'Cable de carga rápida',
    'UPS 650 VA',
    'UPS 1000 VA',
    'Regulador de voltaje',
    'Multitoma 6 salidas',
    'Adaptador de corriente 45 W',
    'Power bank MagSafe',
    'Cargador de auto 30 W',
    'Estación de carga USB',
    'Pilas recargables AA',
  ],
  Oficina: [
    'Impresora térmica',
    'Impresora multifuncional',
    'Escáner de documentos',
    'Calculadora científica',
    'Grapadora metálica',
    'Perforadora de escritorio',
    'Set de plumas',
    'Libreta ejecutiva',
    'Organizador de escritorio',
    'Lámpara de escritorio',
    'Silla ergonómica',
    'Descansapiés',
    'Pizarrón blanco',
    'Etiquetadora',
    'Papel tamaño carta',
    'Archivador de carpetas',
  ],
  Redes: [
    'Router WiFi 6',
    'Router WiFi 6E',
    'Repetidor WiFi',
    'Switch 8 puertos',
    'Switch 16 puertos',
    'Access point PoE',
    'Módem DOCSIS',
    'Patch panel 24',
    'Tarjeta de red USB',
    'Adaptador WiFi USB',
    'Firewall de escritorio',
    'Antena WiFi externa',
    'Kit de red mesh',
    'Inyector PoE',
    'Cable de red Cat 6 10 m',
    'Organizador de rack',
  ],
};

const FEATURED = [
  {
    name: 'Auriculares Pro X',
    category: 'Audio',
    sku: 'AUD-001',
    stock: 8,
    minStock: 10,
    price: 59.9,
    location: 'Pasillo A · Estante 3',
    description:
      'Auriculares inalámbricos con cancelación de ruido. Color negro · Bluetooth 5.3.',
  },
  {
    name: 'Teclado inalámbrico',
    category: 'Accesorios',
    sku: 'TEC-002',
    stock: 45,
    minStock: 20,
    price: 449,
    location: 'Pasillo A · Estante 1',
    description:
      'Teclado inalámbrico de perfil bajo con conexión Bluetooth y receptor USB. Incluye garantía de 12 meses.',
  },
  {
    name: 'Mouse ergonómico',
    category: 'Accesorios',
    sku: 'MOU-003',
    stock: 32,
    minStock: 20,
    price: 279,
    location: 'Pasillo A · Estante 2',
    description:
      'Mouse ergonómico con diseño vertical, seis botones y conexión inalámbrica. Incluye garantía de 12 meses.',
  },
  {
    name: 'Monitor 24 pulgadas',
    category: 'Pantallas',
    sku: 'MON-004',
    stock: 6,
    minStock: 10,
    price: 3299,
    location: 'Pasillo B · Estante 1',
    description:
      'Monitor Full HD de 24 pulgadas con panel IPS, HDMI y DisplayPort. Incluye garantía de 12 meses.',
  },
  {
    name: 'Cable USB-C 1 m',
    category: 'Cables',
    sku: 'CAB-005',
    stock: 120,
    minStock: 50,
    price: 89,
    location: 'Pasillo C · Estante 4',
    description:
      'Cable USB-C de 1 metro para carga rápida y transferencia de datos. Incluye garantía de 12 meses.',
  },
];

const LOW_STOCK_NAMES = new Set([
  'Soporte para monitor',
  'Batería externa 20 000 mAh',
  'Etiquetadora',
  'Repetidor WiFi',
]);

const PRICE_RANGES = {
  Audio: [199, 2499],
  Accesorios: [89, 1299],
  Pantallas: [1499, 8999],
  Cables: [39, 499],
  Almacenamiento: [199, 3499],
  Energía: [199, 2999],
  Oficina: [49, 3999],
  Redes: [299, 3999],
};

const DESCRIPTION_BY_CATEGORY = {
  Audio: 'Equipo de audio para uso profesional. Incluye garantía de 12 meses.',
  Accesorios: 'Accesorio compatible con equipos de cómputo. Incluye garantía de 12 meses.',
  Pantallas: 'Pantalla de alta definición para estación de trabajo. Incluye garantía de 12 meses.',
  Cables: 'Cable de alta durabilidad para conexiones diarias. Incluye garantía de 12 meses.',
  Almacenamiento: 'Unidad de almacenamiento de alto rendimiento. Incluye garantía de 12 meses.',
  Energía: 'Solución de energía para equipos portátiles. Incluye garantía de 12 meses.',
  Oficina: 'Artículo de oficina para uso diario. Incluye garantía de 12 meses.',
  Redes: 'Equipo de conectividad para redes empresariales. Incluye garantía de 12 meses.',
};

export function iconForProduct(name, category) {
  if (/mouse/i.test(name)) return 'mouse';
  if (/teclado/i.test(name)) return 'keyboard';
  if (/monitor|pantalla|televisor/i.test(name)) return 'monitor';
  if (/cable/i.test(name)) return 'cable-data';
  if (/auricular|audífono/i.test(name)) return 'headphones';
  if (/bocina|barra|subwoofer|altavoz/i.test(name)) return 'speaker';
  if (/micrófono/i.test(name)) return 'microphone';
  if (/impresora/i.test(name)) return 'printer';
  if (/router|wifi|wi-fi/i.test(name)) return 'router-wireless';
  if (/ssd|hdd|disco|nas/i.test(name)) return 'harddisk';
  if (/usb|memoria|microsd|tarjeta/i.test(name)) return 'usb';
  if (/batería|power bank/i.test(name)) return 'battery-charging';
  if (/cargador|ups|regulador/i.test(name)) return 'power-plug';
  if (/laptop|portátil/i.test(name)) return 'laptop';
  if (/tablet/i.test(name)) return 'tablet';
  if (/teléfono|smartphone/i.test(name)) return 'cellphone';
  if (/watch|reloj/i.test(name)) return 'watch';
  if (/gaming|gamepad/i.test(name)) return 'gamepad-variant';
  if (/lámpara|luz/i.test(name)) return 'lightbulb-outline';
  if (/silla|escritorio|organizador/i.test(name)) return 'briefcase-outline';
  if (/etiquetadora/i.test(name)) return 'tag-outline';
  return CATEGORIES.find((categoryItem) => categoryItem.name === category)?.icon || 'package-variant';
}

function priceFor(category, index) {
  const [min, max] = PRICE_RANGES[category] || [99, 999];
  const raw = min + ((index * 173) % Math.max(1, max - min));
  const rounded = Math.min(max, Math.round(raw / 10) * 10 + 0.9);
  return rounded;
}

export function createSeedProducts() {
  const now = Date.now();
  const products = [];
  const usedFeatured = new Set(FEATURED.map((item) => item.name));
  let runningId = 1;

  FEATURED.forEach((item, index) => {
    const category = CATEGORIES.find((entry) => entry.name === item.category);
    products.push({
      id: `p-${String(runningId).padStart(3, '0')}`,
      name: item.name,
      sku: item.sku,
      category: item.category,
      categoryId: category?.code || 'GEN',
      stock: item.stock,
      minStock: item.minStock,
      price: item.price,
      location: item.location,
      description: item.description,
      icon: iconForProduct(item.name, item.category),
      photo: null,
      createdAt: new Date(now - index * 3600000).toISOString(),
    });
    runningId += 1;
  });

  let normalIndex = 0;

  CATEGORIES.forEach((category, categoryIndex) => {
    const names = PRODUCT_NAMES[category.name].filter((name) => !usedFeatured.has(name));
    names.forEach((name, index) => {
      const isLow = LOW_STOCK_NAMES.has(name);
      let stock;
      let minStock;

      if (isLow) {
        stock = 4;
        minStock = 6;
      } else {
        stock = normalIndex < 61 ? 9 : 8;
        minStock = 5;
        normalIndex += 1;
      }

      const suffix = String(runningId).padStart(3, '0');
      const location = `Pasillo ${['A', 'B', 'C', 'D'][(runningId + categoryIndex) % 4]} · Estante ${
        ((runningId + index) % 5) + 1
      }`;

      products.push({
        id: `p-${suffix}`,
        name,
        sku: `${category.code}-${suffix}`,
        category: category.name,
        categoryId: category.code,
        stock,
        minStock,
        price: priceFor(category.name, runningId + index),
        location,
        description: DESCRIPTION_BY_CATEGORY[category.name],
        icon: iconForProduct(name, category.name),
        photo: null,
        createdAt: new Date(now - (5 + runningId) * 3600000).toISOString(),
      });
      runningId += 1;
    });
  });

  return products;
}

function dateAt(daysAgo, hours, minutes) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

export function createSeedMovements(products) {
  const bySku = (sku) => products.find((product) => product.sku === sku)?.id;
  const movements = [
    {
      id: 'm-001',
      productId: bySku('AUD-001'),
      type: 'salida',
      quantity: 2,
      reason: 'Venta',
      note: 'Venta en mostrador',
      date: dateAt(0, 9, 42),
      responsible: CURRENT_USER.name,
    },
    {
      id: 'm-002',
      productId: bySku('TEC-002'),
      type: 'entrada',
      quantity: 20,
      reason: 'Reposición de proveedor',
      note: 'Pedido OC-2026-041',
      date: dateAt(0, 9, 15),
      responsible: CURRENT_USER.name,
    },
    {
      id: 'm-003',
      productId: bySku('MOU-003'),
      type: 'salida',
      quantity: 5,
      reason: 'Venta',
      note: 'Pedido de cliente',
      date: dateAt(1, 16, 30),
      responsible: CURRENT_USER.name,
    },
    {
      id: 'm-004',
      productId: bySku('MON-004'),
      type: 'salida',
      quantity: 4,
      reason: 'Venta',
      note: 'Entrega a sucursal norte',
      date: dateAt(1, 12, 10),
      responsible: CURRENT_USER.name,
    },
    {
      id: 'm-005',
      productId: bySku('CAB-005'),
      type: 'entrada',
      quantity: 50,
      reason: 'Reposición de proveedor',
      note: 'Pedido OC-2026-038',
      date: dateAt(5, 11, 20),
      responsible: CURRENT_USER.name,
    },
    {
      id: 'm-006',
      productId: bySku('AUD-001'),
      type: 'entrada',
      quantity: 10,
      reason: 'Reposición de proveedor',
      note: 'Pedido OC-2026-038',
      date: dateAt(6, 11, 10),
      responsible: CURRENT_USER.name,
    },
  ].filter((movement) => movement.productId);

  return movements.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const MOVEMENT_REASONS = {
  entrada: [
    'Reposición de proveedor',
    'Devolución de cliente',
    'Inventario inicial',
    'Ajuste de inventario',
    'Transferencia entre almacenes',
  ],
  salida: [
    'Venta',
    'Uso interno',
    'Merma',
    'Devolución a proveedor',
    'Ajuste de inventario',
    'Transferencia entre almacenes',
  ],
};

export const SORT_OPTIONS = [
  { label: 'Más recientes', value: 'recent' },
  { label: 'Nombre (A-Z)', value: 'name' },
  { label: 'Menor stock', value: 'stock-asc' },
  { label: 'Mayor stock', value: 'stock-desc' },
  { label: 'Precio: menor a mayor', value: 'price-asc' },
  { label: 'Precio: mayor a menor', value: 'price-desc' },
];
