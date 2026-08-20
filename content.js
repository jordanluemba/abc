window.LCL_SHARED_CONTENT = {
  articles: [
    { id: 1, cat: 'Analyse', title: 'Le grand rendez-vous de Lubumbashi tient toutes ses promesses', excerpt: 'Dans un Kamalondo plein, le TP Mazembe a trouvé les ressources pour renverser Vita Club.', date: '22 août 2025', isoDate: '2025-08-22', read: '6 min', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=85', status: 'Publié' },
    { id: 2, cat: 'Portrait', title: 'Glody Likonza, le métronome qui donne le tempo', excerpt: 'Lecture du jeu, volume et justesse : le milieu s’installe au cœur du projet des Corbeaux.', date: '21 août 2025', isoDate: '2025-08-21', read: '4 min', image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=85', status: 'Publié' },
    { id: 3, cat: 'Coulisses', title: 'Dans les coulisses de la nouvelle génération d’académies', excerpt: 'Des terrains de quartier aux pelouses de l’élite, immersion dans les filières de formation.', date: '20 août 2025', isoDate: '2025-08-20', read: '8 min', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=85', status: 'Publié' },
    { id: 4, cat: 'Data', title: 'Ce que racontent les six premières journées', excerpt: 'Buts, possession, efficacité : les premiers signaux forts de la saison 2025-2026.', date: '19 août 2025', isoDate: '2025-08-19', read: '5 min', image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=800&q=85', status: 'Publié' }
  ],
  tv: [
    { id: 1, title: 'Le vestiaire après le choc', meta: 'Épisode 08 · 18 min', type: 'Épisode TV', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=85', status: 'Publié' },
    { id: 2, title: 'Kinshasa, passion tribune', meta: 'Reportage · 24 min', type: 'Reportage', image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=85', status: 'Publié' },
    { id: 3, title: 'Un derby raconté par ses légendes', meta: 'Interview · 31 min', type: 'Interview', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=85', status: 'Publié' }
  ],
  magazines: [
    { id: 'numero-03', number: 'N° 03', season: '2025-2026', title: 'Le grand rendez-vous', date: '22 août 2025', cover: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=85', intro: 'Une édition consacrée aux nouveaux visages, aux grands rendez-vous et aux chiffres qui dessinent la saison.', contents: 24, theme: 'Dossier · Analyse · Data', status: 'Publié' },
    { id: 'numero-02', number: 'N° 02', season: '2024-2025', title: 'Les bâtisseurs du championnat', date: '30 juin 2025', cover: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=85', intro: 'Portraits, coulisses et archives : celles et ceux qui font grandir le football congolais.', contents: 25, theme: 'Portrait · Coulisses · Rétrospective', status: 'Publié' },
    { id: 'numero-01', number: 'N° 01', season: '2023-2024', title: 'La mémoire en mouvement', date: '15 juillet 2024', cover: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=85', intro: 'Le premier chapitre de notre mémoire numérique : clubs historiques, matchs fondateurs et récits de tribunes.', contents: 22, theme: 'Histoire · Records · Impact partenaire', status: 'Publié' }
  ],
  ads: [
    { id: 101, title: 'Votre marque au cœur de la Ligue 1 RDC', advertiser: 'Les Coulisses · partenaire', kicker: 'Partenaire officiel', copy: 'Espace publicitaire · format responsive', format: 'Leaderboard', status: 'Active', link: '', image: '' }
  ]
};
window.LCL_SHARED_CONTENT.read = () => {
  const stored = JSON.parse(localStorage.getItem('lcl-dashboard-data') || 'null');
  const storedArticles = stored?.articles || [];
  const storedMedia = stored?.media || [];
  const storedAds = stored?.ads || [];
  const articles = window.LCL_SHARED_CONTENT.articles.map(item => {
    const override = storedArticles.find(row => row.id === item.id || row.title === item.title);
    return override ? { ...item, ...override, cat: override.category || item.cat, date: item.date, excerpt: override.excerpt || item.excerpt } : item;
  });
  const customArticles = storedArticles.filter(row => !window.LCL_SHARED_CONTENT.articles.some(item => item.id === row.id || item.title === row.title)).map(row => ({ ...row, cat: row.category || 'Actualités', read: row.read || '—', image: row.image || '' }));
  const tv = window.LCL_SHARED_CONTENT.tv.map(item => {
    const override = storedMedia.find(row => row.title === item.title);
    return override ? { ...item, ...override, meta: `${override.type || item.type} · ${override.duration || ''}` } : item;
  });
  const magazines = window.LCL_SHARED_CONTENT.magazines.map(item => {
    const override = storedMedia.find(row => row.title.includes(item.title));
    return override ? { ...item, ...override, title: item.title, date: item.date } : item;
  });
  const ads = window.LCL_SHARED_CONTENT.ads.map(item => ({ ...item, ...(storedAds.find(row => row.id === item.id || row.title === item.title) || {}) })).concat(storedAds.filter(row => !window.LCL_SHARED_CONTENT.ads.some(item => item.id === row.id || item.title === row.title)));
  return { articles: [...articles, ...customArticles], tv, magazines, ads };
};
