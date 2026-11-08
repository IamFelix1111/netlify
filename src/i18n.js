// Shared site translations used by every page.
// Usage: elements with data-i18n="key" get their innerHTML replaced on language switch.
// Missing translations fall back to the language's `fallback` declared in
// window.LANGS below, then to English.

// Languages shown by <lang-select>; components.js reads window.LANGS.
// `fallback` (optional) is tried when a key has no translation for `code`,
// before the site-wide last resort (English).
window.LANGS = [
    { code: 'de',    name: 'Deutsch',   label: 'DE' },
    { code: 'en',    name: 'English',   label: 'EN' },
    { code: 'es',    name: 'Español',   label: 'ES' },
    { code: 'fr',    name: 'Français',  label: 'FR' },
    { code: 'it',    name: 'Italiano',  label: 'IT' },
    { code: 'ja',    name: '日本語',     label: '日' },
    { code: 'ko',    name: '한국어',     label: '한' },
    { code: 'pt',    name: 'Português', label: 'PT' },
    { code: 'ru',    name: 'Русский',   label: 'RU' },
    { code: 'zh-cn', name: '简体中文',   label: '中' },
    { code: 'zh-tw', name: '繁體中文',   label: '繁', fallback: 'zh-cn' },
];

window.I18N = {
    'back': {
        'de': `&leftarrow; Start`,
        'en': `&leftarrow; Home`,
        'es': `&leftarrow; Inicio`,
        'fr': `&leftarrow; Accueil`,
        'it': `&leftarrow; Home`,
        'ja': `&leftarrow; ホーム`,
        'ko': `&leftarrow; 홈`,
        'pt': `&leftarrow; Início`,
        'ru': `&leftarrow; Главная`,
        'zh-cn': `&leftarrow; 主页`,
        'zh-tw': '&leftarrow; 首頁'
    },
    'links': {
        'de': `Links`,
        'en': `Links`,
        'es': `Enlaces`,
        'fr': `Liens`,
        'it': `Collegamenti`,
        'ja': `リンク`,
        'ko': `링크`,
        'pt': `Links`,
        'ru': `Ссылки`,
        'zh-cn': `链接`,
        'zh-tw': '連結'
    },
    'downloads': {
        'de': `Downloads`,
        'en': `Downloads`,
        'es': `Descargas`,
        'fr': `Téléchargements`,
        'it': `Download`,
        'ja': `ダウンロード`,
        'ko': `다운로드`,
        'pt': `Downloads`,
        'ru': `Скачать`,
        'zh-cn': `下载`,
        'zh-tw': `下載`
    },
    'source-code': {
        'de': `Quellcode`,
        'en': `Source code`,
        'es': `Código fuente`,
        'fr': `Code source`,
        'it': `Codice sorgente`,
        'ja': `ソースコード`,
        'ko': `소스 코드`,
        'pt': `Código-fonte`,
        'ru': `Исходный код`,
        'zh-cn': `源代码`,
        'zh-tw': '原始碼'
    },
    'issues': {
        'de': `Probleme`,
        'en': `Issues`,
        'es': `Problemas`,
        'fr': `Problèmes`,
        'it': `Problemi`,
        'ja': `問題`,
        'ko': `문제`,
        'pt': `Problemas`,
        'ru': `Проблемы`,
        'zh-cn': `问题`,
        'zh-tw': '問題'
    },
};
