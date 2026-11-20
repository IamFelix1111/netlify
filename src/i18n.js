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
    'back-return': {
        'de': `&leftarrow; Zurück`,
        'en': `&leftarrow; Back`,
        'es': `&leftarrow; Volver`,
        'fr': `&leftarrow; Retour`,
        'it': `&leftarrow; Indietro`,
        'ja': `&leftarrow; 戻る`,
        'ko': `&leftarrow; 뒤로`,
        'pt': `&leftarrow; Voltar`,
        'ru': `&leftarrow; Назад`,
        'zh-cn': `&leftarrow; 返回`,
        'zh-tw': '&leftarrow; 返回'
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
    'issue-report': {
        'de': `Problem melden`,
        'en': `Report an issue`,
        'es': `Informar de un problema`,
        'fr': `Signaler un problème`,
        'it': `Segnala un problema`,
        'ja': `問題を報告`,
        'ko': `문제 보고`,
        'pt': `Reportar um problema`,
        'ru': `Сообщить о проблеме`,
        'zh-cn': `反馈问题`,
        'zh-tw': `回報問題`
    },
    'issue-note': {
        'de': `Kein GitHub-Konto nötig — deine Meldung geht direkt an den Entwickler.`,
        'en': `No GitHub account needed — your report goes straight to the developer.`,
        'es': `No necesitas cuenta de GitHub: tu informe llega directamente al desarrollador.`,
        'fr': `Aucun compte GitHub requis — votre signalement parvient directement au développeur.`,
        'it': `Non serve un account GitHub: la tua segnalazione arriva direttamente allo sviluppatore.`,
        'ja': `GitHubアカウントは不要です。報告は直接開発者に届きます。`,
        'ko': `GitHub 계정이 필요 없습니다. 보고서는 개발자에게 바로 전달됩니다.`,
        'pt': `Não é precisa conta do GitHub — seu relato vai direto para o desenvolvedor.`,
        'ru': `Учётная запись GitHub не нужна — сообщение попадёт напрямую к разработчику.`,
        'zh-cn': `无需 GitHub 账号，反馈会直接发送给开发者。`,
        'zh-tw': `無需 GitHub 帳號，回報會直接傳送給開發者。`
    },
    'issue-open-form': {
        'de': `Zum Formular`,
        'en': `Open the issue form`,
        'es': `Abrir el formulario`,
        'fr': `Ouvrir le formulaire`,
        'it': `Apri il modulo`,
        'ja': `フォームを開く`,
        'ko': `양식 열기`,
        'pt': `Abrir o formulário`,
        'ru': `Открыть форму`,
        'zh-cn': `打开反馈表单`,
        'zh-tw': `開啟回報表單`
    },
    'issue-project': {
        'de': `Projekt`,
        'en': `Project`,
        'es': `Proyecto`,
        'fr': `Projet`,
        'it': `Progetto`,
        'ja': `プロジェクト`,
        'ko': `프로젝트`,
        'pt': `Projeto`,
        'ru': `Проект`,
        'zh-cn': `项目`,
        'zh-tw': `專案`
    },
    'issue-contact': {
        'de': `Kontakt (optional)`,
        'en': `Contact (optional)`,
        'es': `Contacto (opcional)`,
        'fr': `Contact (facultatif)`,
        'it': `Contatto (opzionale)`,
        'ja': `連絡先（任意）`,
        'ko': `연락처 (선택)`,
        'pt': `Contato (opcional)`,
        'ru': `Контакт (необязательно)`,
        'zh-cn': `联系方式（可选）`,
        'zh-tw': `聯絡方式（可選）`
    },
    'issue-message': {
        'de': `Problembeschreibung`,
        'en': `Describe the issue`,
        'es': `Describe el problema`,
        'fr': `Décrivez le problème`,
        'it': `Descrivi il problema`,
        'ja': `問題の内容`,
        'ko': `문제 설명`,
        'pt': `Descreva o problema`,
        'ru': `Опишите проблему`,
        'zh-cn': `问题描述`,
        'zh-tw': `問題說明`
    },
    'issue-submit': {
        'de': `Senden`,
        'en': `Submit`,
        'es': `Enviar`,
        'fr': `Envoyer`,
        'it': `Invia`,
        'ja': `送信`,
        'ko': `제출`,
        'pt': `Enviar`,
        'ru': `Отправить`,
        'zh-cn': `提交`,
        'zh-tw': `送出`
    },
};
