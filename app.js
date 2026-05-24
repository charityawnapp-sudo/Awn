(function () {
    const data = window.AWN_DATA;
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang') === 'ar' ? 'ar' : 'en';
    const content = data.content[lang];
    const body = document.body;
    const html = document.documentElement;

    function asset(path) {
        return encodeURI(path);
    }

    function buildLangUrl(nextLang) {
        return `index.html?lang=${nextLang}`;
    }

    function renderNav() {
        const navLinks = document.getElementById('navLinks');
        navLinks.innerHTML = content.nav.map((item, index) => (
            `<li><a href="#section-${index}" data-section="${index}">${item}</a></li>`
        )).join('');
    }

    function renderSections() {
        const root = document.getElementById('appSections');
        const valuesHtml = content.vision.values.map((value) => (
            `<div class="value-card"><div class="value-icon"><i class="fas fa-star"></i></div><h4>${value}</h4></div>`
        )).join('');
        const timelineHtml = data.projectTimeline.map((item) => (
            `<div class="timeline-item">
                <div class="timeline-content card">
                    <div class="timeline-date"><i class="fas fa-${item.icon} timeline-icon"></i>${item.date}</div>
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-description">${item.description}</p>
                </div>
            </div>`
        )).join('');
        const techHtml = data.technologyStack.map((tech) => (
            `<div class="tech-card card" style="border-left-color: ${tech.color};">
                <div class="tech-icon" style="color: ${tech.color};"><i class="${tech.icon}"></i></div>
                <h3>${tech.title}</h3>
                <p class="tech-description">${tech.description}</p>
            </div>`
        )).join('');
        const futureHtml = data.futureWork.map((item) => (
            `<div class="future-card card" style="border-top-color: ${item.color};">
                <div class="future-icon" style="color: ${item.color};"><i class="${item.icon}"></i></div>
                <h3>${item.title}</h3>
                <p class="future-description">${item.description}</p>
            </div>`
        )).join('');
        const docsLang = `lang=${lang}`;
        const documentsHtml = `
            <a href="document.html?type=report&${docsLang}" class="document-card report-card card">
                <div class="document-icon"><i class="fas fa-file-pdf"></i></div>
                <h3>${content.documents.report}</h3>
                <p>${content.ui.report_text}</p>
                <div class="btn btn-primary" style="margin-top: 20px;"><i class="fas fa-eye"></i>${content.documents.view}</div>
            </a>
            <a href="document.html?type=ppt&${docsLang}" class="document-card ppt-card card">
                <div class="document-icon"><i class="fas fa-file-pdf"></i></div>
                <h3>${content.documents.powerpoint}</h3>
                <p>${content.ui.ppt_text}</p>
                <div class="btn btn-primary" style="margin-top: 20px;"><i class="fas fa-eye"></i>${content.documents.view}</div>
            </a>
            <a href="document.html?type=poster&${docsLang}" class="document-card poster-card card">
                <div class="document-icon"><i class="fas fa-file-pdf"></i></div>
                <h3>${content.documents.poster}</h3>
                <p>${content.ui.poster_text}</p>
                <div class="btn btn-primary" style="margin-top: 20px;"><i class="fas fa-eye"></i>${content.documents.view}</div>
            </a>`;
        const videosHtml = `
            <div class="video-wrapper">
                <video controls preload="metadata">
                    <source src="${asset(data.videos.english)}" type="video/mp4">
                </video>
                <div class="video-label"><i class="fas fa-play-circle"></i>${content.elevator.english}</div>
            </div>
            <div class="video-wrapper">
                <video controls preload="metadata">
                    <source src="${asset(data.videos.arabic)}" type="video/mp4">
                </video>
                <div class="video-label"><i class="fas fa-play-circle"></i>${content.elevator.arabic}</div>
            </div>`;
        const teamHtml = data.teamMembers.map((member) => (
            `<div class="member-card card">
                <div class="member-photo" style="background: ${member.photo_color};">
                    <img src="${asset(member.image)}" alt="${member.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" onerror="this.style.display='none'; this.parentElement.textContent='${member.name.charAt(0)}';">
                </div>
                <h3 class="member-name">${member.name}</h3>
                <div class="member-links">
                    <a href="${member.linkedin}" target="_blank" class="member-link" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
                    <a href="mailto:${member.email}" class="member-link" title="Email"><i class="fas fa-envelope"></i></a>
                </div>
            </div>`
        )).join('');
        const cvsHtml = data.teamMembers.map((member) => (
            `<div class="cv-card card" data-member="${member.name}">
                <div class="cv-member-photo" style="background: ${member.photo_color};">
                    <img src="${asset(member.image)}" alt="${member.name}" class="member-img" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" onerror="this.style.display='none'; this.parentElement.textContent='${member.name.charAt(0)}';">
                </div>
                <h3 class="cv-member-name">${member.name}</h3>
                <div class="cv-qr-container">
                    <img src="${asset(member.cv_qr)}" alt="QR Code for ${member.name}'s CV" class="qr-image" data-original-src="${member.cv_qr}" data-member="${member.name}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;">
                    <div class="qr-loading" style="display: flex; text-align: center; padding: 40px;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 30px; color: #3498db; margin-bottom: 10px;"></i>
                        <p style="color: var(--color-text-light); font-size: 12px;">${content.cvs.loading}</p>
                    </div>
                    <div class="qr-error" style="display: none; text-align: center; padding: 30px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: #e74c3c; margin-bottom: 15px;"></i>
                        <p style="color: #e74c3c; margin-bottom: 10px; font-size: 14px;">${content.cvs.error}</p>
                        <button class="retry-qr-btn" style="padding: 8px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px; margin: 0 auto;">
                            <i class="fas fa-redo"></i> ${content.cvs.retry}
                        </button>
                    </div>
                </div>
                <p class="qr-text">${content.cvs.placeholder}</p>
                <a href="${asset(member.cv_file)}" download class="btn btn-primary cv-download-btn" data-cv-name="${member.name}">
                    <i class="fas fa-download"></i>${content.cvs.download}
                </a>
            </div>`
        )).join('');
        const contactLabel = content.ui.email_label;

        root.innerHTML = `
            <section id="section-0" class="hero-section">
                <div class="container">
                    <div class="hero-content animate-slide-up">
                        <h1 class="hero-title">${content.hero.title}</h1>
                        <p class="hero-subtitle">${content.hero.subtitle}</p>
                        <div class="hero-cta">
                            <a href="#section-6" class="btn btn-primary"><i class="fas fa-download"></i>${content.hero.button}</a>
                            <a href="#section-9" class="btn btn-secondary"><i class="fas fa-users"></i>${content.team.title}</a>
                        </div>
                    </div>
                </div>
                <div class="hero-particles" id="heroParticles"></div>
            </section>

            <section id="section-1" class="section-spacing">
                <div class="container">
                    <div class="section-title">
                        <h2>${content.about.title}</h2>
                        <p class="section-subtitle">${data.projectSubtitle}</p>
                    </div>
                    <div class="about-content">
                        <div class="card"><p class="about-text">${content.about.text}</p></div>
                    </div>
                </div>
            </section>

            <section id="section-2" class="section-spacing" style="background: var(--color-bg-light);">
                <div class="container">
                    <div class="section-title"><h2>${content.vision.title}</h2></div>
                    <div class="vision-grid">
                        <div class="vision-card card">
                            <div class="vision-icon"><i class="fas fa-eye"></i></div>
                            <h3>${content.vision.vision_title}</h3>
                            <p class="vision-text">${content.vision.vision_text}</p>
                        </div>
                        <div class="mission-card card">
                            <div class="mission-icon"><i class="fas fa-bullseye"></i></div>
                            <h3>${content.vision.mission_title}</h3>
                            <p class="mission-text">${content.vision.mission_text}</p>
                        </div>
                    </div>
                    <div class="section-title" style="margin-top: 60px; margin-bottom: 30px;"><h3>${content.vision.values_title}</h3></div>
                    <div class="values-grid">${valuesHtml}</div>
                </div>
            </section>

            <section id="section-3" class="section-spacing">
                <div class="container">
                    <div class="section-title">
                        <h2>${content.timeline.title}</h2>
                        <p class="section-subtitle">${content.timeline.subtitle}</p>
                    </div>
                    <div class="timeline-container"><div class="timeline">${timelineHtml}</div></div>
                </div>
            </section>

            <section id="section-4" class="section-spacing" style="background: var(--color-bg-light);">
                <div class="container">
                    <div class="section-title">
                        <h2>${content.technology.title}</h2>
                        <p class="section-subtitle">${content.technology.subtitle}</p>
                    </div>
                    <div class="tech-grid">${techHtml}</div>
                </div>
            </section>

            <section id="section-5" class="section-spacing">
                <div class="container">
                    <div class="section-title">
                        <h2>${content.future.title}</h2>
                        <p class="section-subtitle">${content.future.subtitle}</p>
                    </div>
                    <div class="future-grid">${futureHtml}</div>
                </div>
            </section>

            <section id="section-6" class="section-spacing" style="background: var(--color-bg-light);">
                <div class="container">
                    <div class="section-title">
                        <h2>${content.download.title}</h2>
                        <p class="section-subtitle">${content.download.text}</p>
                    </div>
                    <div class="download-grid">
                        <div class="download-card demo-card card">
                            <div class="download-icon"><i class="fas fa-globe"></i></div>
                            <h3>Live Demo</h3>
                            <p>${content.download.demo_text}</p>
                            <div class="download-info">
                                <a href="${data.demoUrl}" target="_blank" class="btn btn-success"><i class="fas fa-external-link-alt"></i>${content.download.demo}</a>
                            </div>
                        </div>
                        <div class="download-card android-card card">
                            <div class="download-icon"><i class="fab fa-android"></i></div>
                            <h3>Android App</h3>
                            <p>${content.ui.android_text}</p>
                            <div class="download-info">
                                <a href="${data.apkUrl}" target="_blank" class="btn btn-primary"><i class="fas fa-download"></i>${content.download.android}</a>
                                <p class="download-size">${content.download.size_android}</p>
                            </div>
                        </div>
                        <div class="download-card ios-card card">
                            <div class="download-icon"><i class="fab fa-apple"></i></div>
                            <h3>iOS App</h3>
                            <p>${content.ui.ios_text}</p>
                            <div class="download-info">
                                <a href="${data.ipaUrl}" target="_blank" class="btn btn-primary"><i class="fas fa-download"></i>${content.download.ios}</a>
                                <p class="download-size">${content.download.size_ios}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="section-7" class="section-spacing">
                <div class="container">
                    <div class="section-title"><h2>${content.documents.title}</h2></div>
                    <div class="documents-grid">${documentsHtml}</div>
                </div>
            </section>

            <section id="section-8" class="section-spacing" style="background: var(--color-bg-light);">
                <div class="container">
                    <div class="section-title"><h2>${content.elevator.title}</h2></div>
                    <div class="videos-grid">${videosHtml}</div>
                </div>
            </section>

            <section id="section-9" class="section-spacing">
                <div class="container">
                    <div class="section-title">
                        <h2>${content.team.title}</h2>
                        <p class="section-subtitle">${content.team.supervisor}: ${data.supervisor.name}</p>
                    </div>
                    <div class="team-container">
                        <div class="supervisor-section">
                            <div class="supervisor-card-expanded card">
                                <div class="supervisor-header">
                                    <div class="supervisor-photo">
                                        <img src="${asset(data.supervisor.image)}" alt="${data.supervisor.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md);" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=&quot;fas fa-user-tie&quot;></i>';">
                                    </div>
                                    <div class="supervisor-info">
                                        <h3 class="supervisor-name">${data.supervisor.name}</h3>
                                        <p class="supervisor-title">${data.supervisor.title}</p>
                                        <p class="supervisor-department">${data.supervisor.department}</p>
                                        <div class="supervisor-links">
                                            <a href="${data.supervisor.linkedin}" target="_blank" class="supervisor-link" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
                                            <a href="mailto:${data.supervisor.email}" class="supervisor-link" title="Email"><i class="fas fa-envelope"></i></a>
                                        </div>
                                    </div>
                                </div>
                                <div class="supervisor-description">${content.ui.supervisor_description}</div>
                            </div>
                        </div>
                        <div class="team-members-section">
                            <div class="team-grid">${teamHtml}</div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="section-10" class="section-spacing" style="background: var(--color-bg-light);">
                <div class="container">
                    <div class="section-title">
                        <h2>${content.cvs.title}</h2>
                        <p class="section-subtitle">${content.cvs.subtitle}</p>
                    </div>
                    <div class="cvs-grid">${cvsHtml}</div>
                </div>
            </section>

            <section id="section-11" class="section-spacing">
                <div class="container">
                    <div class="section-title">
                        <h2>${content.social.title}</h2>
                        <p class="section-subtitle">${content.social.text}</p>
                    </div>
                    <div class="social-grid">
                        <a href="https://www.instagram.com/bh_awn1/" target="_blank" class="social-card instagram-card card">
                            <div class="social-icon"><i class="fab fa-instagram"></i></div>
                            <h3>Instagram</h3>
                            <p>@bh_awn1</p>
                            <div class="btn btn-secondary">${content.social.follow}</div>
                        </a>
                        <a href="https://x.com/BH_AWN1" target="_blank" class="social-card twitter-card card">
                            <div class="social-icon"><i class="fab fa-twitter"></i></div>
                            <h3>X</h3>
                            <p>@BH_AWN1</p>
                            <div class="btn btn-secondary">${content.social.follow}</div>
                        </a>
                        <a href="https://www.tiktok.com/@awn_charities" target="_blank" class="social-card tiktok-card card">
                            <div class="social-icon"><i class="fab fa-tiktok"></i></div>
                            <h3>TikTok</h3>
                            <p>@awn_charities</p>
                            <div class="btn btn-secondary">${content.social.follow}</div>
                        </a>
                        <a href="mailto:charity.awn.app@gmail.com" class="social-card email-card card">
                            <div class="social-icon"><i class="fas fa-envelope"></i></div>
                            <h3>Email</h3>
                            <p>${contactLabel}</p>
                            <div class="btn btn-secondary">${content.contact.button}</div>
                        </a>
                    </div>
                </div>
            </section>

            <section id="section-12" class="section-spacing contact-section">
                <div class="container">
                    <div class="section-title">
                        <h2 style="color: white;">${content.contact.title}</h2>
                        <p class="section-subtitle" style="color: rgba(255,255,255,0.8);">${content.contact.text}</p>
                    </div>
                    <div class="contact-content">
                        <div class="contact-email">
                            <a href="mailto:charity.awn.app@gmail.com">charity.awn.app@gmail.com</a>
                        </div>
                        <a href="mailto:charity.awn.app@gmail.com" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i>${content.contact.button}
                        </a>
                    </div>
                </div>
            </section>
        `;
    }

    function renderFooter() {
        document.getElementById('appFooter').innerHTML = `
            <div class="container">
                <div class="footer-content">
                    <div class="footer-logo">
                        <div class="logo">
                            <div class="logo-image-container">
                                <img src="${data.logoUrl}" alt="AWN Logo" class="logo-image">
                            </div>
                            <div class="logo-text">
                                <div class="logo-title">AWN</div>
                                <div class="logo-tagline">Bahrain Charities Network</div>
                            </div>
                        </div>
                        <p style="margin-top: 20px; color: rgba(255,255,255,0.8);">${content.footer.tagline}</p>
                    </div>
                    <div class="footer-contact">
                        <h3>${content.ui.contact_info}</h3>
                        <p><i class="fas fa-envelope"></i> charity.awn.app@gmail.com</p>
                        <p><i class="fas fa-university"></i> ${content.ui.university}</p>
                        <p style="margin-top: 20px; color: rgba(255,255,255,0.8);">${content.footer.supervisor}</p>
                    </div>
                </div>
                <div class="copyright">${content.footer.copyright}</div>
            </div>
        `;
    }

    function injectFloatingIcons() {
        const heroSection = document.getElementById('section-0');
        for (let i = 0; i < 10; i += 1) {
            const icon = document.createElement('div');
            icon.className = 'floating-icon';
            icon.style.top = `${Math.floor(Math.random() * 81) + 10}%`;
            icon.style.left = `${Math.floor(Math.random() * 81) + 10}%`;
            icon.style.animationDelay = `${i * 0.5}s`;
            icon.innerHTML = '<i class="fas fa-heart"></i>';
            heroSection.appendChild(icon);
        }
    }

    function addAIMessage(message, isUser) {
        const aiChatBody = document.getElementById('aiChatBody');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${isUser ? 'user' : 'bot'}`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'ai-avatar';
        avatarDiv.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'ai-content';
        contentDiv.innerHTML = `<p>${message}</p>`;

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        aiChatBody.appendChild(messageDiv);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type || 'info'}`;
        notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i><span>${message}</span>`;
        notification.style.position = 'fixed';
        notification.style.bottom = '30px';
        notification.style.right = '30px';
        notification.style.background = type === 'success' ? 'var(--primary-green)' : 'var(--primary-blue)';
        notification.style.color = 'white';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = 'var(--radius-md)';
        notification.style.boxShadow = 'var(--shadow-lg)';
        notification.style.zIndex = '10000';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '12px';
        notification.style.fontWeight = '600';
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.5s ease';
        if (body.dir === 'rtl') {
            notification.style.right = 'auto';
            notification.style.left = '30px';
        }
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    function hideQRLoading(container) {
        const loadingDiv = container.querySelector('.qr-loading');
        const errorDiv = container.querySelector('.qr-error');
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (errorDiv) errorDiv.style.display = 'none';
    }

    function showQRError(imgElement) {
        const container = imgElement.parentElement;
        const loadingDiv = container.querySelector('.qr-loading');
        const errorDiv = container.querySelector('.qr-error');
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (errorDiv) {
            errorDiv.style.display = 'flex';
            imgElement.style.display = 'none';
        }
    }

    function retryQRImage(imgElement) {
        const originalSrc = imgElement.getAttribute('data-original-src');
        const memberName = imgElement.getAttribute('data-member');
        const container = imgElement.parentElement;
        const loadingDiv = container.querySelector('.qr-loading');
        const errorDiv = container.querySelector('.qr-error');
        if (loadingDiv) loadingDiv.style.display = 'flex';
        if (errorDiv) errorDiv.style.display = 'none';

        const newImg = new Image();
        newImg.className = 'qr-image';
        newImg.src = `${asset(originalSrc)}?v=${Date.now()}&cache=${Math.random()}`;
        newImg.alt = `QR Code for ${memberName}'s CV`;
        newImg.style.cssText = 'width: 100%; height: 100%; object-fit: contain; border-radius: 8px; opacity: 0; transition: opacity 0.3s ease;';
        newImg.setAttribute('data-original-src', originalSrc);
        newImg.setAttribute('data-member', memberName);
        newImg.onload = function () {
            if (imgElement.parentNode) {
                imgElement.parentNode.replaceChild(newImg, imgElement);
            }
            setTimeout(() => {
                newImg.style.opacity = '1';
            }, 100);
            hideQRLoading(container);
            const retryBtn = container.querySelector('.retry-qr-btn');
            if (retryBtn) {
                retryBtn.onclick = function () {
                    retryQRImage(newImg);
                };
            }
        };
        newImg.onerror = function () {
            showQRError(this);
        };
    }

    function initializeQRImages() {
        document.querySelectorAll('.qr-image').forEach((img) => {
            const container = img.parentElement;
            const loadingDiv = container.querySelector('.qr-loading');
            const retryBtn = container.querySelector('.retry-qr-btn');
            if (loadingDiv) loadingDiv.style.display = 'flex';

            img.onload = function () {
                hideQRLoading(container);
                this.style.opacity = '1';
            };
            img.onerror = function () {
                showQRError(this);
            };

            if (img.complete) {
                if (img.naturalWidth === 0) {
                    showQRError(img);
                } else {
                    hideQRLoading(container);
                }
            }

            if (retryBtn) {
                retryBtn.onclick = function () {
                    retryQRImage(img);
                };
            }

            setTimeout(() => {
                if (!img.complete || img.naturalWidth === 0) {
                    retryQRImage(img);
                }
            }, 5000);
        });
    }

    function createParticles() {
        const heroParticles = document.getElementById('heroParticles');
        heroParticles.innerHTML = '';
        const particleCount = 25;
        const particleColor = body.classList.contains('dark-mode') ? 'rgba(52, 152, 219, 0.15)' : 'rgba(52, 152, 219, 0.1)';
        for (let i = 0; i < particleCount; i += 1) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = `${Math.random() * 150 + 50}px`;
            particle.style.height = particle.style.width;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.background = particleColor;
            particle.style.opacity = Math.random() * 0.2 + 0.1;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.animationDuration = `${Math.random() * 4 + 3}s`;
            heroParticles.appendChild(particle);
        }
    }

    function getLocalAIResponse(message) {
        const normalized = message.toLowerCase();
        const isArabic = body.dir === 'rtl';

        if (
            normalized.includes('donat') ||
            normalized.includes('تبرع') ||
            normalized.includes('donation') ||
            normalized.includes('campaign')
        ) {
            return isArabic
                ? 'يمكنك التبرع عبر منصة عون من خلال الحملات النشطة ووسائل الدفع المتاحة مثل BenefitPay والبطاقات. اختر الجمعية أو الحملة المناسبة ثم أكمل التبرع بخطوات بسيطة وآمنة. 💙'
                : 'You can donate through AWN using active campaigns and available payment methods like BenefitPay and cards. Just choose the charity or campaign and complete the donation in a few secure steps. 💙';
        }

        if (
            normalized.includes('volunteer') ||
            normalized.includes('volunteering') ||
            normalized.includes('تطوع')
        ) {
            return isArabic
                ? 'للتطوع في عون، تصفح الفرص المتاحة ثم قدّم على الفرصة المناسبة لك. بعد ذلك تتم مراجعة الطلب من الجهة الخيرية وإشعارك بالحالة. 🤝'
                : 'To volunteer with AWN, browse the available opportunities and apply for the one that fits you. The charity then reviews your request and updates you with the status. 🤝';
        }

        if (
            normalized.includes('charit') ||
            normalized.includes('جمعية') ||
            normalized.includes('charities')
        ) {
            return isArabic
                ? 'منصة عون تجمع الجمعيات الخيرية البحرينية الموثقة في مكان واحد، بحيث يمكنك تصفحها ومعرفة حملاتها وفرص التطوع الخاصة بها بسهولة.'
                : 'AWN brings verified Bahrain-based charities together in one place, so you can browse them easily and explore their campaigns and volunteering opportunities.';
        }

        if (
            normalized.includes('support') ||
            normalized.includes('contact') ||
            normalized.includes('help') ||
            normalized.includes('دعم') ||
            normalized.includes('تواصل')
        ) {
            return isArabic
                ? 'يمكنك التواصل مع الدعم عبر البريد: charity.awn.app@gmail.com أو الهاتف: 66606998. أوقات العمل: الأحد إلى الخميس من 8:00 صباحاً إلى 5:00 مساءً. نحن هنا للمساعدة 💙'
                : 'You can contact support by email at charity.awn.app@gmail.com or by phone at 66606998. Working hours are Sunday to Thursday, 8:00 AM to 5:00 PM. We are here to help 💙';
        }

        if (
            normalized.includes('awn') ||
            normalized.includes('عون') ||
            normalized.includes('platform') ||
            normalized.includes('app')
        ) {
            return isArabic
                ? 'عون منصة موحدة في البحرين للتبرعات والتطوع والحملات الخيرية، وهدفها تسهيل الوصول إلى الجمعيات الموثقة وجعل العمل الخيري أكثر تنظيماً وشفافية.'
                : 'AWN is a unified Bahrain platform for donations, volunteering, and charity campaigns, designed to make verified charitable work more organized and transparent.';
        }

        return content.ui.assistant_fallback;
    }

    async function sendAIMessage() {
        const aiInput = document.getElementById('aiInput');
        const aiSendBtn = document.getElementById('aiSendBtn');
        const message = aiInput.value.trim();
        if (!message) return;
        addAIMessage(message, true);
        aiInput.value = '';
        aiInput.disabled = true;
        aiSendBtn.disabled = true;
        aiSendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
            await new Promise((resolve) => {
                window.setTimeout(resolve, 350);
            });
            addAIMessage(getLocalAIResponse(message), false);
        } finally {
            aiInput.disabled = false;
            aiSendBtn.disabled = false;
            aiSendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
            aiInput.focus();
        }
    }

    function setupUI() {
        document.title = data.pageTitle;
        html.lang = lang;
        html.dir = lang === 'ar' ? 'rtl' : 'ltr';
        body.dir = html.dir;
        document.getElementById('logoImage').src = data.logoUrl;
        document.getElementById('aiAssistantTitle').textContent = content.ui.assistant_title;
        document.getElementById('aiInput').placeholder = content.ui.assistant_placeholder;
        document.querySelectorAll('.lang-option').forEach((link) => {
            link.href = buildLangUrl(link.dataset.lang);
        });
    }

    function setupInteractions() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        const themeToggle = document.getElementById('themeToggle');
        const langBtn = document.getElementById('langBtn');
        const langDropdown = document.getElementById('langDropdown');
        const aiAssistantBtn = document.getElementById('aiAssistantBtn');
        const aiAssistantPopup = document.getElementById('aiAssistantPopup');
        const aiCloseBtn = document.getElementById('aiCloseBtn');
        const aiInput = document.getElementById('aiInput');
        const aiSendBtn = document.getElementById('aiSendBtn');
        const scrollTopBtn = document.getElementById('scrollTopBtn');

        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('show') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        document.addEventListener('click', (event) => {
            if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navLinks.classList.remove('show');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            themeToggle.innerHTML = body.classList.contains('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
            createParticles();
        });

        if (localStorage.getItem('darkMode') === 'true') {
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        langBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (event) => {
            if (!langBtn.contains(event.target) && !langDropdown.contains(event.target)) {
                langDropdown.classList.remove('show');
            }
        });

        aiAssistantBtn.addEventListener('click', () => {
            aiAssistantPopup.classList.toggle('show');
            if (aiAssistantPopup.classList.contains('show')) aiInput.focus();
        });

        aiCloseBtn.addEventListener('click', () => {
            aiAssistantPopup.classList.remove('show');
        });

        document.addEventListener('click', (event) => {
            if (!aiAssistantBtn.contains(event.target) && !aiAssistantPopup.contains(event.target) && aiAssistantPopup.classList.contains('show')) {
                aiAssistantPopup.classList.remove('show');
            }
        });

        aiInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') sendAIMessage();
        });
        aiSendBtn.addEventListener('click', sendAIMessage);

        setTimeout(() => {
            if (document.getElementById('aiChatBody').children.length === 0) {
                addAIMessage(content.ui.assistant_greeting, false);
            }
        }, 500);

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.visibility = 'visible';
                scrollTopBtn.style.transform = 'scale(1)';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.visibility = 'hidden';
                scrollTopBtn.style.transform = 'scale(0.8)';
            }
            const header = document.querySelector('header');
            if (window.scrollY > 50) {
                header.style.boxShadow = 'var(--shadow-md)';
                header.style.borderBottom = '1px solid var(--color-border)';
            } else {
                header.style.boxShadow = 'var(--shadow-sm)';
                header.style.borderBottom = '1px solid var(--nav-border)';
            }
        });

        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-links a');
        function updateActiveNav() {
            let current = '';
            let closestDistance = Infinity;
            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const scrollPosition = window.scrollY + 150;
                if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
                const distance = Math.abs(sectionTop - scrollPosition);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    if (!current) current = section.getAttribute('id');
                }
            });
            navItems.forEach((item) => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) item.classList.add('active');
            });
        }
        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav();

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (event) {
                event.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) {
                    navLinks.classList.remove('show');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
                }
            });
        });

        document.querySelectorAll('[data-cv-name]').forEach((link) => {
            link.addEventListener('click', () => {
                showNotification(content.ui.cv_downloading.replace('{name}', link.dataset.cvName), 'success');
            });
        });
    }

    function setupAnimations() {
        createParticles();
        setTimeout(() => {
            showNotification(content.ui.welcome, 'info');
        }, 1000);
        document.querySelectorAll('.card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-slide-up');
        });
        setTimeout(initializeQRImages, 500);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.timeline-item').forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            });
        }, { threshold: 0.1 });
        const timelineSection = document.getElementById('section-3');
        if (timelineSection) observer.observe(timelineSection);
    }

    setupUI();
    renderNav();
    renderSections();
    renderFooter();
    injectFloatingIcons();
    setupInteractions();
    setupAnimations();
}());
