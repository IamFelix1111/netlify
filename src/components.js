// Reusable site components: <lang-select>
// noinspection JSUnusedGlobalSymbols

// Fallback chain for a language: the language itself, then its `fallback`
// declared in window.LANGS, then English as the site-wide last resort.
function i18nChain(lang) {
    const chain = [lang];
    const entry = (window.LANGS || []).find(l => l.code === lang);
    if (entry && entry.fallback) chain.push(entry.fallback);
    if (!chain.includes('en')) chain.push('en');
    return chain;
}

// Apply translations to all [data-i18n] elements.
function applyI18n(lang) {
    const dict = window.I18N;
    if (!dict) return;
    const fallbacks = i18nChain(lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (!dict[key]) return;
        for (const code of fallbacks) {
            if (dict[key][code] != null) {
                el.innerHTML = dict[key][code];
                return;
            }
        }
    });
}

// Language list lives in /i18n.js (window.LANGS), loaded before this file
// on every page that has a <lang-select>. Pages without i18n.js (the home
// page) have no language picker, so an empty list is fine.
const LANGS = window.LANGS || [];

class LangSelect extends HTMLElement {
    connectedCallback() {
        if (this._inited) return;
        this._inited = true;

        this.innerHTML = `
            <div class="lang-btn" aria-haspopup="listbox" aria-expanded="false">
                <svg class="lang-icon" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <span class="lang-label">EN</span>
                <svg class="caret" viewBox="0 0 12 12">
                    <path d="M2 4l4 4 4-4" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <ul class="lang-menu" role="listbox">
                ${LANGS.map(l => `<li data-lang="${l.code}" role="option">${l.name}</li>`).join('\n                ')}
            </ul>
        `;

        const html = document.documentElement;
        const btn = this.querySelector('.lang-btn');
        const label = this.querySelector('.lang-label');
        const menu = this.querySelector('.lang-menu');

        const apply = lang => {
            html.classList.remove(...LANGS.map(l => 'lang-' + l.code));
            html.classList.add('lang-' + lang);
            html.lang = lang;
            const entry = LANGS.find(l => l.code === lang);
            if (entry) label.textContent = entry.label;
            menu.querySelectorAll('li').forEach((li) =>
                li.classList.toggle('active', li.dataset.lang === lang)
            );
            applyI18n(lang);
            try {
                localStorage.setItem('lang', lang);
            } catch (err) {
                console.error(err);
            }
        };

        const close = () => {
            this.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        };

        let saved = 'en';
        try {
            const v = localStorage.getItem('lang');
            if (LANGS.some(l => l.code === v)) saved = v;
        } catch (err) {
            console.error(err);
        }

        // Wait for the rest of the DOM ([data-i18n] elements) before applying.
        const init = () => apply(saved);
        if (document.readyState === 'loading')
            document.addEventListener('DOMContentLoaded', init);
        else
            init();

        btn.addEventListener('click', e => {
            e.stopPropagation();
            const isOpen = this.classList.toggle('open');
            btn.setAttribute('aria-expanded', String(isOpen));
        });

        menu.addEventListener('click', e => {
            const li = e.target.closest('li');
            if (li) {
                apply(li.dataset.lang);
                close();
            }
        });

        document.addEventListener('click', close);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') close();
        });
    }
}

customElements.define('lang-select', LangSelect);

window.addEventListener('DOMContentLoaded', () => document.body.classList.add('with-script'));
