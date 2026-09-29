        // Claves de LocalStorage
        const STORAGE_KEY_NEWS = 'informador_news';
        const STORAGE_KEY_FAVS = 'informador_favs';

        // Base de Datos Inicial Predeterminada
        const datosIniciales = [
            {
                id: 1,
                title: "Inversión Histórica en Infraestructura de Energías Limpias",
                category: "Política",
                date: "2026-09-28",
                summary: "Acuerdo multinacional destinará miles de millones a granjas solares y parques eólicos continentales.",
                content: "<p>Líderes gubernamentales formalizaron el paquete de financiamiento verde más extenso del siglo. Se prevé que las obras generen miles de empleos técnicos directos.</p><p><strong>Puntos clave:</strong> Reducción inmediata de emisiones térmicas y subsidios para la adopción doméstica de paneles fotovoltaicos.</p>",
                image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80",
                featured: true
            },
            {
                id: 2,
                title: "Mercados Financieros Cierran Semana con Alzas Históricas",
                category: "Economía",
                date: "2026-09-27",
                summary: "Los índices de tecnología y banca muestran una recuperación sólida tras anuncios de bancos centrales.",
                content: "<p>Wall Street y las bolsas europeas experimentaron un avance generalizado. Analistas atribuyen la confianza del mercado a la estabilización de los tipos de interés.</p>",
                image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
                featured: true
            },
            {
                id: 3,
                title: "Avanza el Desarrollo de Modelos Diagnósticos con Inteligencia Artificial",
                category: "Tecnología",
                date: "2026-09-26",
                summary: "Científicos validan algoritmos con un 99% de precisión en la detección temprana de enfermedades.",
                content: "<p>Un nuevo estudio clínico demostró cómo la inteligencia artificial asiste exitosamente a los radiólogos en la identificación oportuna de anomalías complejas.</p>",
                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
                featured: false
            },
            {
                id: 4,
                title: "Gran Final del Torneo Nacional Rompe Récords de Sintonía",
                category: "Deportes",
                date: "2026-09-25",
                summary: "Más de tres millones de espectadores siguieron el desenlace del campeonato en vivo.",
                content: "<p>En un partido lleno de emociones de principio a fin, el equipo local se coronó campeón tras una emocionante definición por penales.</p>",
                image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
                featured: false
            }
        ];

        // Variables de Estado en Memoria
        let listaactualpublicaciones = [];
        let favoritosId = [];
        let modalparapublicacionesseleccionadas = null;

        // Modales de Bootstrap Instance
        let modaldetallepublicaciones = null;
        let modalcrudpublicaciones = null;

        // Inicialización  ---
        window.addEventListener('DOMContentLoaded', () => {
            // Instanciar Modales
            modaldetallepublicaciones = new bootstrap.Modal(document.getElementById('newsDetailModal'));
            modalcrudpublicaciones = new bootstrap.Modal(document.getElementById('crudNewsModal'));

            // Cargar datos de localStorage o inicializar
            cargardatosdesdestorage();

            // Renderizar vistas
            purgarvistas();
        });

        function cargardatosdesdestorage() {
            const storedNews = localStorage.getItem(STORAGE_KEY_NEWS);
            if (storedNews) {
                listaactualpublicaciones = JSON.parse(storedNews);
            } else {
                listaactualpublicaciones = [...datosIniciales];
                guardarpublicacionesstorage();
            }

            const storedFavs = localStorage.getItem(STORAGE_KEY_FAVS);
            if (storedFavs) {
                favoritosId = JSON.parse(storedFavs);
            } else {
                favoritosId = [];
            }

            actualizarfavoritocontador();
        }

        function guardarpublicacionesstorage() {
            localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(listaactualpublicaciones));
        }

        function guardarfavoritosstorage() {
            localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favoritosId));
            actualizarfavoritocontador();
        }

        function actualizarfavoritocontador() {
            document.getElementById('fav-count-badge').innerText = favoritosId.length;
        }

        // Navegación entre Secciones (SPA) ---
        function navigateTo(sectionId) {
            document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

            const targetSection = document.getElementById(`section-${sectionId}`);
            const targetNav = document.getElementById(`nav-${sectionId}`);

            if (targetSection) targetSection.classList.add('active');
            if (targetNav) targetNav.classList.add('active');

            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Refrescar vistas al navegar
            if (sectionId === 'favorites') rendirizarsesionfavoritos();
            if (sectionId === 'admin') renderizartabla();
        }

        // --- Renderizado de Noticia Card HTML ---
        function crearpublicacionescards(news) {
            const isFav = favoritosId.includes(news.id);
            return `
                <div class="col">
                    <article class="news-card bg-white">
                        <div class="position-relative">
                            <!-- Requisito 1: Imagen con alt y title -->
                            <img src="${news.image}" 
                                 alt="Imagen ilustrativa: ${news.title}" 
                                 title="${news.title}" 
                                 onerror="this.src='https://placehold.co/600x400/1e293b/ffffff?text=Noticia'">
                            <span class="badge bg-dark position-absolute top-0 start-0 m-3">${news.category}</span>
                        </div>
                        <div class="card-body">
                            <small class="text-muted mb-1 d-block"><i class="fa-regular fa-calendar me-1"></i>${news.date}</small>
                            <!-- Requisito 1: Nombre / Título -->
                            <h3 class="h5 card-title fw-bold text-dark mb-2">${news.title}</h3>
                            <!-- Requisito 1: Descripción Breve -->
                            <p class="card-text text-secondary small flex-grow-1">${news.summary}</p>
                            
                            <div class="d-flex justify-content-between align-items-center pt-3 border-top mt-2">
                                <!-- Requisito 1: Botón de acción ver más -->
                                <button class="btn btn-sm btn-outline-danger font-weight-bold" onclick="openNewsDetailModal(${news.id})">
                                    Ver más &rarr;
                                </button>
                                <!-- Requisito 3: Botón Favoritos -->
                                <button class="btn-fav ${isFav ? 'active' : ''}" onclick="togglefavorito(${news.id})" title="Guardar en favoritos">
                                    <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </article>
                </div>
            `;
        }

        // ---Renderizado General de Vistas ---
        function purgarvistas() {
            sesionhome();
            rendizarsesioncatalogo('Todos');
            rendirizarsesionfavoritos();
            renderizartabla();
        }

        function sesionhome() {
            const fg = document.getElementById('home-featured-grid');
            const fl = listaactualpublicaciones.filter(n => n.featured).slice(0, 3);
            const dl = fl.length > 0 ? fl : listaactualpublicaciones.slice(0, 3);

            fg.innerHTML = dl.map(crearpublicacionescards).join('');
        }

        function rendizarsesioncatalogo(category) {
            const grid = document.getElementById('catalog-cards-grid');
            const list = category === 'Todos' 
                ? listaactualpublicaciones 
                : listaactualpublicaciones.filter(n => n.category.toLowerCase() === category.toLowerCase());

            grid.innerHTML = list.length > 0 
                ? list.map(crearpublicacionescards).join('')
                : `<div class="col-12"><div class="alert alert-secondary text-center">No hay noticias en esta categoría.</div></div>`;
        }

        function filterCatalog(category, buttonEl) {
            document.querySelectorAll('#section-catalog .btn-group .btn').forEach(btn => btn.classList.remove('active'));
            if(buttonEl) buttonEl.classList.add('active');
            rendizarsesioncatalogo(category);
        }

        function rendirizarsesionfavoritos() {
            const grid = document.getElementById('favorites-cards-grid');
            const emptyAlert = document.getElementById('empty-favorites-alert');

            const favList = listaactualpublicaciones.filter(n => favoritosId.includes(n.id));

            if (favList.length === 0) {
                grid.innerHTML = '';
                emptyAlert.classList.remove('d-none');
            } else {
                emptyAlert.classList.add('d-none');
                grid.innerHTML = favList.map(crearpublicacionescards).join('');
            }
        }

        // --- Toggle de Favoritos ---
        function togglefavorito(newsId) {
            const idx = favoritosId.indexOf(newsId);
            if (idx === -1) {
                favoritosId.push(newsId);
            } else {
                favoritosId.splice(idx, 1);
            }
            guardarfavoritosstorage();
            purgarvistas();

            // Si el modal está abierto, refrescar botón de favorito interno
            if (modalparapublicacionesseleccionadas && modalparapublicacionesseleccionadas.id === newsId) {
                actualizamodalboton();
            }
        }

        // ---Vista Detalle de Noticia en Modal ---
        function openNewsDetailModal(newsId) {
            const news = listaactualpublicaciones.find(n => n.id === newsId);
            if (!news) return;

            modalparapublicacionesseleccionadas = news;

            document.getElementById('modal-detail-title').innerText = news.title;
            
            const isFav = favoritosId.includes(news.id);
            const modalBody = document.getElementById('modal-detail-body');

            modalBody.innerHTML = `
                <div class="mb-3">
                    <span class="badge bg-danger">${news.category}</span>
                    <small class="text-muted ms-2"><i class="fa-regular fa-calendar me-1"></i>${news.date}</small>
                </div>
                <!-- Requisito 2: Imagen representativa -->
                <img src="${news.image}" alt="${news.title}" class="img-fluid rounded mb-4 w-100" style="max-height:350px; object-fit:cover;">
                
                <!-- Requisito 2: Información completa -->
                <div class="news-full-content leading-relaxed">
                    ${news.content}
                </div>
            `;

            actualizamodalboton();
            modaldetallepublicaciones.show();
        }

        function actualizamodalboton() {
            if (!modalparapublicacionesseleccionadas) return;
            const isFav = favoritosId.includes(modalparapublicacionesseleccionadas.id);
            const btn = document.getElementById('modal-btn-fav');
            btn.className = isFav ? "btn btn-danger" : "btn btn-outline-danger";
            btn.innerHTML = `<i class="fa-${isFav ? 'solid' : 'regular'} fa-heart me-1"></i> ${isFav ? 'En Favoritos' : 'Agregar a Favoritos'}`;
        }

        function toggleModalFavorite() {
            if (modalparapublicacionesseleccionadas) {
                togglefavorito(modalparapublicacionesseleccionadas.id);
            }
        }

        function contactAboutThisNews() {
            if (!modalparapublicacionesseleccionadas) return;
            modaldetallepublicaciones.hide();
            navigateTo('contact');
            document.getElementById('contact-subject').value = `Consulta sobre: ${modalparapublicacionesseleccionadas.title}`;
        }

        // --- Página de Contacto y Validaciones  ---
        function submitContactForm(event) {
            event.preventDefault();
            const form = event.target;

            // Validación nativa con Bootstrap 'was-validated'
            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            form.classList.add('was-validated');

            // Mostrar mensaje de confirmación
            const successToast = document.getElementById('contact-success-toast');
            successToast.classList.remove('d-none');

            // Reiniciar formulario
            form.reset();
            form.classList.remove('was-validated');

            window.scrollTo({ top: document.getElementById('section-contact').offsetTop - 80, behavior: 'smooth' });
        }

        // --- Gestión Básica de Noticias ---
        function renderizartabla() {
            const tbody = document.getElementById('crud-news-table-body');
            if (!tbody) return;

            tbody.innerHTML = listaactualpublicaciones.map(news => `
                <tr>
                    <th scope="row">#${news.id}</th>
                    <td><img src="${news.image}" alt="Thumb" class="rounded" style="width: 45px; height: 35px; object-fit: cover;"></td>
                    <td class="fw-semibold text-dark">${news.title}</td>
                    <td><span class="badge bg-secondary">${news.category}</span></td>
                    <td class="small text-muted">${news.date}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditNewsModal(${news.id})" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <!-- Requisito 6b: Eliminar noticias existentes -->
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteNewsCrud(${news.id})" title="Eliminar">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        function openCreateNewsModal() {
            document.getElementById('crud-news-form').reset();
            document.getElementById('crud-news-form').classList.remove('was-validated');
            document.getElementById('crud-news-id').value = '';
            document.getElementById('crudModalTitle').innerText = 'Publicar Nueva Noticia';
            modalcrudpublicaciones.show();
        }

        function openEditNewsModal(newsId) {
            const news = listaactualpublicaciones.find(n => n.id === newsId);
            if (!news) return;

            document.getElementById('crud-news-form').classList.remove('was-validated');
            document.getElementById('crud-news-id').value = news.id;
            document.getElementById('crud-title').value = news.title;
            document.getElementById('crud-category').value = news.category;
            document.getElementById('crud-image').value = news.image;
            document.getElementById('crud-summary').value = news.summary;
            
            // Convertir HTML básico a texto plano para el textarea
            const tmp = document.createElement('div');
            tmp.innerHTML = news.content;
            document.getElementById('crud-content').value = tmp.innerText;

            document.getElementById('crud-featured').checked = !!news.featured;
            document.getElementById('crudModalTitle').innerText = `Editar Noticia #${news.id}`;

            modalcrudpublicaciones.show();
        }

        // Crear / Guardar noticias con sincronización localStorage
        function saveNewsCrud(event) {
            event.preventDefault();
            const form = event.target;

            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            const idVal = document.getElementById('crud-news-id').value;
            const title = document.getElementById('crud-title').value.trim();
            const category = document.getElementById('crud-category').value;
            const image = document.getElementById('crud-image').value.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';
            const summary = document.getElementById('crud-summary').value.trim();
            const rawContent = document.getElementById('crud-content').value.trim();
            const featured = document.getElementById('crud-featured').checked;

            const formattedContent = `<p>${rawContent.replace(/\n\n/g, '</p><p>')}</p>`;

            if (idVal) {
                // Modo Editar
                const newsIdx = listaactualpublicaciones.findIndex(n => n.id === parseInt(idVal));
                if (newsIdx !== -1) {
                    listaactualpublicaciones[newsIdx] = {
                        ...listaactualpublicaciones[newsIdx],
                        title, category, image, summary, content: formattedContent, featured
                    };
                }
            } else {
                // Modo Crear Nuevo
                const newId = listaactualpublicaciones.length > 0 ? Math.max(...listaactualpublicaciones.map(n => n.id)) + 1 : 1;
                const newArticle = {
                    id: newId,
                    title,
                    category,
                    date: new Date().toISOString().split('T')[0],
                    summary,
                    content: formattedContent,
                    image,
                    featured
                };
                listaactualpublicaciones.unshift(newArticle);
            }

            guardarpublicacionesstorage();
            purgarvistas();
            modalcrudpublicaciones.hide();
        }

        // Eliminar noticia con confirmación
        function deleteNewsCrud(newsId) {
            if (confirm(`¿Está seguro de que desea eliminar permanentemente la noticia #${newsId}?`)) {
                listaactualpublicaciones = listaactualpublicaciones.filter(n => n.id !== newsId);
                // Si estaba en favoritos, removerla también
                favoritosId = favoritosId.filter(id => id !== newsId);
                
                guardarpublicacionesstorage();
                guardarfavoritosstorage();
                purgarvistas();
            }
        }