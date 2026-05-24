(function () {
    const data = window.AWN_DATA;
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang') === 'ar' ? 'ar' : 'en';
    const type = params.get('type');
    const body = document.body;
    const html = document.documentElement;
    const content = data.content[lang];
    const viewerText = content.viewer;
    const documentMeta = data.documents[type] || data.documents.report;

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const themeToggle = document.getElementById('themeToggle');
    const loadingContainer = document.getElementById('loadingContainer');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const retryButton = document.getElementById('retryButton');
    const pdfContainer = document.getElementById('pdfContainer');
    const pdfPagesContainer = document.getElementById('pdfPagesContainer');
    const documentInfo = document.getElementById('documentInfo');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const firstPageBtn = document.getElementById('firstPageBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const lastPageBtn = document.getElementById('lastPageBtn');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomLevel = document.getElementById('zoomLevel');

    let pdfDoc = null;
    let currentPage = 1;
    let totalPages = 1;
    let scale = 1.3;
    const pageCanvases = {};

    function formatBytes(bytes, precision) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        const size = Math.max(bytes, 0);
        const power = Math.min(Math.floor((size ? Math.log(size) : 0) / Math.log(1024)), units.length - 1);
        return `${Math.round((size / (1024 ** power)) * (10 ** precision)) / (10 ** precision)} ${units[power]}`;
    }

    function updateTexts() {
        html.lang = lang;
        html.dir = lang === 'ar' ? 'rtl' : 'ltr';
        body.dir = html.dir;
        document.title = `${viewerText.viewing[type] || viewerText.viewing.report} - AWN`;
        document.getElementById('backButton').href = `index.html?lang=${lang}#section-7`;
        document.getElementById('backButtonText').textContent = viewerText.back;
        document.getElementById('documentTitle').textContent = viewerText.viewing[type] || viewerText.viewing.report;
        document.getElementById('pageOfText').textContent = viewerText.of;
        document.getElementById('fullscreenText').textContent = viewerText.fullscreen;
        document.getElementById('downloadText').textContent = viewerText.download;
        document.getElementById('loadingText').textContent = viewerText.loading;
        document.getElementById('errorTitle').textContent = viewerText.error;
        document.getElementById('retryText').textContent = viewerText.retry;
        document.getElementById('documentName').textContent = documentMeta.fileName;
        document.getElementById('documentSize').textContent = `${formatBytes(documentMeta.size, 2)} • PDF`;
        document.getElementById('downloadButton').href = documentMeta.file;
        document.getElementById('downloadButton').setAttribute('download', documentMeta.fileName);

        firstPageBtn.title = viewerText.first_page;
        prevPageBtn.title = viewerText.prev_page;
        nextPageBtn.title = viewerText.next_page;
        lastPageBtn.title = viewerText.last_page;
        zoomOutBtn.title = viewerText.zoom_out;
        zoomInBtn.title = viewerText.zoom_in;
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        themeToggle.innerHTML = body.classList.contains('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('documentDarkMode', body.classList.contains('dark-mode'));
    });

    if (localStorage.getItem('darkMode') === 'true' || localStorage.getItem('documentDarkMode') === 'true') {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            if (pdfContainer.requestFullscreen) {
                pdfContainer.requestFullscreen();
            } else if (pdfContainer.webkitRequestFullscreen) {
                pdfContainer.webkitRequestFullscreen();
            }
            body.classList.add('fullscreen');
            fullscreenBtn.innerHTML = `<i class="fas fa-compress"></i><span>${viewerText.exit_fullscreen}</span>`;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            body.classList.remove('fullscreen');
            fullscreenBtn.innerHTML = `<i class="fas fa-expand"></i><span>${viewerText.fullscreen}</span>`;
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            body.classList.remove('fullscreen');
            fullscreenBtn.innerHTML = `<i class="fas fa-expand"></i><span>${viewerText.fullscreen}</span>`;
        }
    });

    async function renderPage(pageNum) {
        const page = await pdfDoc.getPage(pageNum);
        const pageDiv = document.createElement('div');
        pageDiv.className = 'pdf-page';
        pageDiv.id = `page-${pageNum}`;

        const canvas = document.createElement('canvas');
        canvas.id = `canvas-${pageNum}`;

        const pageNumber = document.createElement('div');
        pageNumber.className = 'page-number';
        pageNumber.textContent = `Page ${pageNum}`;

        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        pageDiv.style.width = `${viewport.width}px`;

        await page.render({
            canvasContext: canvas.getContext('2d'),
            viewport
        }).promise;

        pageDiv.appendChild(canvas);
        pageDiv.appendChild(pageNumber);
        pdfPagesContainer.appendChild(pageDiv);
        pageCanvases[pageNum] = canvas;
    }

    async function renderSinglePage(pageNum) {
        const page = await pdfDoc.getPage(pageNum);
        const canvas = pageCanvases[pageNum];
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale });
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const pageDiv = document.getElementById(`page-${pageNum}`);
        if (pageDiv) pageDiv.style.width = `${viewport.width}px`;
        await page.render({
            canvasContext: context,
            viewport
        }).promise;
    }

    function updatePageInfo() {
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;
        zoomLevel.textContent = `${Math.round(scale * 100)}%`;
    }

    function updateButtons() {
        firstPageBtn.disabled = currentPage <= 1;
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
        lastPageBtn.disabled = currentPage >= totalPages;
    }

    function goToPage(pageNum) {
        if (pageNum < 1 || pageNum > totalPages) return;
        currentPage = pageNum;
        const pageElement = document.getElementById(`page-${pageNum}`);
        if (pageElement) pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updatePageInfo();
        updateButtons();
    }

    async function zoomIn() {
        if (scale >= 3) return;
        scale = Math.round((scale + 0.1) * 10) / 10;
        if (pageCanvases[currentPage]) await renderSinglePage(currentPage);
        zoomLevel.textContent = `${Math.round(scale * 100)}%`;
    }

    async function zoomOut() {
        if (scale <= 0.5) return;
        scale = Math.round((scale - 0.1) * 10) / 10;
        if (pageCanvases[currentPage]) await renderSinglePage(currentPage);
        zoomLevel.textContent = `${Math.round(scale * 100)}%`;
    }

    async function loadPDF() {
        try {
            loadingContainer.style.display = 'flex';
            errorContainer.style.display = 'none';
            pdfPagesContainer.innerHTML = '';
            const loadingTask = pdfjsLib.getDocument(documentMeta.file);
            pdfDoc = await loadingTask.promise;
            totalPages = pdfDoc.numPages;
            for (let pageNum = 1; pageNum <= totalPages; pageNum += 1) {
                await renderPage(pageNum);
            }
            setTimeout(() => {
                loadingContainer.style.opacity = '0';
                setTimeout(() => {
                    loadingContainer.style.display = 'none';
                    loadingContainer.style.opacity = '1';
                    updatePageInfo();
                    updateButtons();
                    documentInfo.style.opacity = '1';
                    setTimeout(() => {
                        documentInfo.style.opacity = '0';
                    }, 5000);
                }, 500);
            }, 1000);
        } catch (error) {
            loadingContainer.style.display = 'none';
            errorMessage.textContent = error.message || 'Failed to load PDF document.';
            errorContainer.style.display = 'flex';
        }
    }

    firstPageBtn.addEventListener('click', () => goToPage(1));
    prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
    lastPageBtn.addEventListener('click', () => goToPage(totalPages));
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    retryButton.addEventListener('click', loadPDF);

    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey || event.metaKey) {
            if (event.key === '+' || event.key === '=') {
                zoomIn();
                event.preventDefault();
            } else if (event.key === '-') {
                zoomOut();
                event.preventDefault();
            }
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            goToPage(currentPage - 1);
            event.preventDefault();
        } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            goToPage(currentPage + 1);
            event.preventDefault();
        }
        if (event.key === 'Home') {
            goToPage(1);
            event.preventDefault();
        } else if (event.key === 'End') {
            goToPage(totalPages);
            event.preventDefault();
        }
        if (event.key === 'Escape' && document.fullscreenElement) {
            document.exitFullscreen();
            body.classList.remove('fullscreen');
            fullscreenBtn.innerHTML = `<i class="fas fa-expand"></i><span>${viewerText.fullscreen}</span>`;
        }
    });

    let scrollTimeout;
    pdfContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollTop = pdfContainer.scrollTop;
            let newPage = 1;
            let minDistance = Infinity;
            for (let i = 1; i <= totalPages; i += 1) {
                const pageEl = document.getElementById(`page-${i}`);
                if (!pageEl) continue;
                const distance = Math.abs(pageEl.offsetTop - scrollTop);
                if (distance < minDistance) {
                    minDistance = distance;
                    newPage = i;
                }
            }
            if (currentPage !== newPage) {
                currentPage = newPage;
                updatePageInfo();
                updateButtons();
            }
        }, 100);
    });

    documentInfo.addEventListener('mouseenter', () => {
        documentInfo.style.opacity = '1';
    });

    window.addEventListener('resize', () => {
        goToPage(currentPage);
    });

    updateTexts();
    loadPDF();
}());
