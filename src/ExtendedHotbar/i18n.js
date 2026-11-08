// ExtendedHotbar page translations.
// Loaded after /i18n.js and merged into the shared dictionary.
// Release metadata: bump these and every language below updates.
// Keep the matching static text in index.html in sync (shown before JS runs).
const EH_VERSION = '1.0.2';
const EH_MC_VERSION = '1.21.11';

window.I18N = window.I18N || {};
Object.assign(window.I18N, {
    'intro': {
        'de': `Lege die unterste Reihe deines Inventars über die Schnellzugriffsleiste und verdopple deine Schnellzugriffs-Slots.`,
        'en': `Place the bottom row of your inventory above the hotbar, doubling your quick-access slots.`,
        'es': `Coloca la fila inferior de tu inventario encima de la barra de acceso rápido, duplicando tus espacios de acceso rápido.`,
        'fr': `Placez la rangée inférieure de votre inventaire au-dessus de la barre de raccourcis, doublant vos emplacements d'accès rapide.`,
        'it': `Posiziona la fila inferiore del tuo inventario sopra la hotbar, raddoppiando i tuoi slot di accesso rapido.`,
        'ja': `インベントリの最下段をホットバーの上に配置し、クイックアクセススロットを2倍にします。`,
        'ko': `인벤토리의 맨 아래 줄을 핫바 위에 배치하여 빠른 접근 슬롯을 두 배로 늘립니다.`,
        'pt': `Coloque a fileira inferior do seu inventário acima da barra de atalhos, dobrando seus espaços de acesso rápido.`,
        'ru': `Разместите нижний ряд вашего инвентаря над панелью быстрого доступа, удваивая количество слотов быстрого доступа.`,
        'zh-cn': `将物品栏底行显示在快捷栏上方，让你的快捷访问格翻倍。`,
        'zh-tw': '將物品欄底行顯示在快捷欄上方，讓你的快捷訪問格翻倍。'
    },
    'version': {
        'de': `Neueste Version: <strong>${EH_VERSION}</strong> für Minecraft <strong>${EH_MC_VERSION}</strong>.`,
        'en': `Latest version: <strong>${EH_VERSION}</strong> for Minecraft <strong>${EH_MC_VERSION}</strong>.`,
        'es': `Última versión: <strong>${EH_VERSION}</strong> para Minecraft <strong>${EH_MC_VERSION}</strong>.`,
        'fr': `Dernière version : <strong>${EH_VERSION}</strong> pour Minecraft <strong>${EH_MC_VERSION}</strong>.`,
        'it': `Ultima versione: <strong>${EH_VERSION}</strong> per Minecraft <strong>${EH_MC_VERSION}</strong>.`,
        'ja': `最新バージョン：<strong>${EH_VERSION}</strong>（Minecraft <strong>${EH_MC_VERSION}</strong> 対応）`,
        'ko': `최신 버전: <strong>${EH_VERSION}</strong> (Minecraft <strong>${EH_MC_VERSION}</strong>용)`,
        'pt': `Versão mais recente: <strong>${EH_VERSION}</strong> para Minecraft <strong>${EH_MC_VERSION}</strong>.`,
        'ru': `Последняя версия: <strong>${EH_VERSION}</strong> для Minecraft <strong>${EH_MC_VERSION}</strong>.`,
        'zh-cn': `最新版本：<strong>${EH_VERSION}</strong>，适用于 Minecraft <strong>${EH_MC_VERSION}</strong>。`,
        'zh-tw': `最新版本：<strong>${EH_VERSION}</strong>，適用於 Minecraft <strong>${EH_MC_VERSION}</strong>。`
    },
    'keybindings': {
        'de': `Tastenkürzel`,
        'en': `Keybindings`,
        'es': `Atajos de teclado`,
        'fr': `Touches`,
        'it': `Tasti rapidi`,
        'ja': `キー操作`,
        'ko': `키 바인딩`,
        'pt': `Atalhos de teclado`,
        'ru': `Клавиши`,
        'zh-cn': `按键`,
        'zh-tw': '按鍵'
    },
    'key-r': {
        'de': `— Tauscht die Schnellzugriffsleiste mit der Reihe darüber.`,
        'en': `— Swap the hotbar with the row above it.`,
        'es': `— Intercambia la barra de acceso rápido con la fila superior.`,
        'fr': `— Échange la barre de raccourcis avec la rangée au-dessus.`,
        'it': `— Scambia la hotbar con la riga sopra.`,
        'ja': `— ホットバーをその上の行と入れ替えます。`,
        'ko': `— 핫바를 위의 줄과 교체합니다.`,
        'pt': `— Troca a barra de atalhos com a fileira acima.`,
        'ru': `— Меняет панель быстрого доступа с рядом над ней.`,
        'zh-cn': `— 交换快捷栏与上方一行。`,
        'zh-tw': '— 交換快捷欄與上方一行。'
    },
    'key-shift-r': {
        'de': `— Tauscht nur die Gegenstände in deiner Hand.`,
        'en': `— Swap only the items in your hand.`,
        'es': `— Intercambia solo los objetos en tu mano.`,
        'fr': `— Échange uniquement les objets en main.`,
        'it': `— Scambia solo gli oggetti in mano.`,
        'ja': `— 手に持っているアイテムだけを入れ替えます。`,
        'ko': `— 손에 든 아이템만 교체합니다.`,
        'pt': `— Troca apenas os itens em sua mão.`,
        'ru': `— Меняет только предметы в руке.`,
        'zh-cn': `— 仅交换手中的物品。`,
        'zh-tw': '— 僅交換手中的物品。'
    },
    'key-slot': {
        'de': `— Drücke die Taste des aktuell ausgewählten Schnellzugriffsleisten-Slots erneut, um nur diesen Slot zu tauschen.`,
        'en': `— Press the currently selected hotbar slot's key again to swap just that slot.`,
        'es': `— Pulsa de nuevo la tecla del espacio seleccionado de la barra para intercambiar solo ese espacio.`,
        'fr': `— Appuie de nouveau sur la touche de l'emplacement sélectionné pour échanger uniquement cet emplacement.`,
        'it': `— Premi di nuovo il tasto dello slot selezionato per scambiare solo quello slot.`,
        'ja': `— 選択中のホットバースロットのキーをもう一度押すと、そのスロットだけ入れ替わります。`,
        'ko': `— 현재 선택된 핫바 슬롯의 키를 다시 누르면 해당 슬롯만 교체됩니다.`,
        'pt': `— Pressione novamente a tecla do espaço selecionado da barra para trocar apenas esse espaço.`,
        'ru': `— Нажмите клавишу выбранного слота панели ещё раз, чтобы поменять только этот слот.`,
        'zh-cn': `— 再次按下当前选中快捷栏格的按键，仅交换该格。`,
        'zh-tw': '— 再次按下目前選中快捷欄格的按鍵，僅交換該格。'
    },
    'key-eq': {
        'de': `— Aktiviert oder deaktiviert die Mod.`,
        'en': `— Enable or disable the mod.`,
        'es': `— Activa o desactiva el mod.`,
        'fr': `— Active ou désactive le mod.`,
        'it': `— Attiva o disattiva la mod.`,
        'ja': `— MODを有効または無効にします。`,
        'ko': `— 모드를 활성화 또는 비활성화합니다.`,
        'pt': `— Ativa ou desativa o mod.`,
        'ru': `— Включает или выключает мод.`,
        'zh-cn': `— 启用或禁用本模组。`,
        'zh-tw': '— 啟用或停用本模組。'
    },
    'key-v': {
        'de': `— Schaltet den Fluent-Modus um.`,
        'en': `— Toggle fluent mode.`,
        'es': `— Activa o desactiva el modo fluido.`,
        'fr': `— Active ou désactive le mode fluide.`,
        'it': `— Attiva o disattiva la modalità fluida.`,
        'ja': `— フルエントモードを切り替えます。`,
        'ko': `— 플루언트 모드를 전환합니다.`,
        'pt': `— Ativa ou desativa o modo fluente.`,
        'ru': `— Переключает плавный режим.`,
        'zh-cn': `— 切换流畅模式。`,
        'zh-tw': '— 切換流暢模式。'
    },
    'keybinds-note': {
        'de': `Alle Tastenkürzel sind in den „Steuerung"-Einstellungen von Minecraft unter der Kategorie „Extended Hotbar" konfigurierbar. Tastenaktionen werden flankengetriggert ausgelöst, ein gedrückt gehaltenes Taste wiederholt die Aktion also nicht.`,
        'en': `All keybinds are configurable in Minecraft's "Controls" settings, under the "Extended Hotbar" category. Key actions are edge-triggered, so holding a key down won't repeat the action.`,
        'es': `Todos los atajos se pueden configurar en los ajustes de "Controles" de Minecraft, en la categoría "Extended Hotbar". Las acciones de teclas se activan por flanco, por lo que mantener pulsada una tecla no repetirá la acción.`,
        'fr': `Toutes les touches sont configurables dans les paramètres « Contrôles » de Minecraft, dans la catégorie « Extended Hotbar ». Les actions de touches sont déclenchées sur front, donc maintenir une touche enfoncée ne répète pas l'action.`,
        'it': `Tutti i tasti rapidi sono configurabili nelle impostazioni "Controlli" di Minecraft, nella categoria "Extended Hotbar". Le azioni dei tasti si attivano sul fronte, quindi tenere premuto un tasto non ripete l'azione.`,
        'ja': `すべてのキー操作は、Minecraftの「操作」設定の「Extended Hotbar」カテゴリで設定できます。キー操作はエッジトリガー方式のため、キーを押し続けても操作は繰り返されません。`,
        'ko': `모든 키 바인딩은 Minecraft의 "조작" 설정에서 "Extended Hotbar" 범주 아래에서 구성할 수 있습니다. 키 동작은 엣지 트리거 방식이므로 키를 계속 누르고 있어도 동작이 반복되지 않습니다.`,
        'pt': `Todos os atalhos podem ser configurados nas configurações de "Controles" do Minecraft, na categoria "Extended Hotbar". As ações de teclas são acionadas por borda, então manter uma tecla pressionada não repetirá a ação.`,
        'ru': `Все клавиши можно настроить в настройках «Управление» Minecraft в категории «Extended Hotbar». Действия клавиш срабатывают по фронту сигнала, поэтому удержание клавиши не повторяет действие.`,
        'zh-cn': `所有按键均可在 Minecraft「控制」设置中的「Extended Hotbar」分类下自定义。按键为边沿触发，长按不会重复触发。`,
        'zh-tw': '所有按鍵均可在 Minecraft「控制」設定中的「Extended Hotbar」分類下自訂。按鍵為邊緣觸發，長按不會重複觸發。'
    },
    'fluent-mode': {
        'de': `Fluent-Modus`,
        'en': `Fluent Mode`,
        'es': `Modo fluido`,
        'fr': `Mode fluide`,
        'it': `Modalità fluida`,
        'ja': `フルエントモード`,
        'ko': `플루언트 모드`,
        'pt': `Modo fluente`,
        'ru': `Плавный режим`,
        'zh-cn': `流畅模式`,
        'zh-tw': '流暢模式'
    },
    'fluent-desc': {
        'de': `Der Fluent-Modus tauscht nahtlos, während du durch eine doppelt breite Schnellzugriffsleiste scrollst, und rendert die zweite Reihe neben der ersten statt darüber. Aktiviere ihn über den Konfigurationsbildschirm (erfordert <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a>) oder durch Drücken von <code>V</code>.`,
        'en': `Fluent mode swaps transparently as you scroll along a double-wide hotbar, rendering the second row next to the first instead of on top. Enable it from the configuration screen (requires <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a>) or by pressing <code>V</code>.`,
        'es': `El modo fluido intercambia de forma transparente mientras te desplazas por una barra de doble ancho, mostrando la segunda fila junto a la primera en lugar de encima. Actívalo desde la pantalla de configuración (requiere <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a>) o pulsando <code>V</code>.`,
        'fr': `Le mode fluide échange de manière transparente lorsque vous faites défiler une barre de largeur double, affichant la deuxième rangée à côté de la première au lieu d'au-dessus. Activez-le depuis l'écran de configuration (nécessite <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a>) ou en appuyant sur <code>V</code>.`,
        'it': `La modalità fluida scambia in modo trasparente mentre scorri lungo una hotbar a doppia larghezza, mostrando la seconda riga accanto alla prima invece che sopra. Attivala dalla schermata di configurazione (richiede <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a>) o premendo <code>V</code>.`,
        'ja': `フルエントモードは、二倍幅のホットバーをスクロールすると透過的に入れ替わり、2行目が1行目の上ではなく横に表示されます。設定画面（<a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a>が必要）または <code>V</code> キーで有効にできます。`,
        'ko': `플루언트 모드는 이중 너비 핫바를 스크롤하면 투명하게 교체되어 두 번째 줄이 첫 번째 줄 위가 아닌 옆에 표시됩니다. 설정 화면(<a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a> 필요) 또는 <code>V</code> 키를 눌러 활성화할 수 있습니다.`,
        'pt': `O modo fluente troca de forma transparente conforme você rola por uma barra de largura dupla, exibindo a segunda fileira ao lado da primeira em vez de sobre ela. Ative-o pela tela de configuração (requer <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a>) ou pressionando <code>V</code>.`,
        'ru': `Плавный режим меняет панели незаметно при прокрутке двойной панели, отображая второй ряд рядом с первым, а не над ним. Включите его в окне настройки (требуется <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a>) или нажатием <code>V</code>.`,
        'zh-cn': `流畅模式会在你沿双倍宽度快捷栏滚动时自动交换，将第二行渲染在第一行旁边而非上方。可通过配置界面（需 <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a>）或按 <code>V</code> 键启用。`,
        'zh-tw': '流暢模式會在你沿雙倍寬度快捷欄滾動時自動交換，將第二行渲染在第一行旁邊而非上方。可透過設定畫面（需 <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a>）或按 <code>V</code> 鍵啟用。'
    },
    'fluent-detail': {
        'de': `Während die sekundäre Schnellzugriffsleiste ausgewählt ist, zeigt das Öffnen deines Inventars oder eines beliebigen Containers (Truhe, Ofen usw.) deine Gegenstände in ihren ursprünglichen Reihen, und Klicken oder Umschalt-Klicken wirkt auf den Gegenstand, den du siehst. Dies funktioniert im Einzelspieler- und Servermodus, sowohl im Überlebens- als auch im Kreativmodus, einschließlich der Objekt-Raster-Registerkarten des Kreativinventars.`,
        'en': `While the secondary hotbar is selected, opening your inventory or any container (chest, furnace, etc.) shows your items in their original rows, and clicking or shift-clicking acts on the item you see. This works in single-player and on servers, in both survival and creative mode, including the creative inventory's item-grid tabs.`,
        'es': `Mientras la barra secundaria está seleccionada, abrir tu inventario o cualquier contenedor (cofre, horno, etc.) muestra tus objetos en sus filas originales, y hacer clic o clic con Shift actúa sobre el objeto que ves. Esto funciona en un jugador y en servidores, tanto en modo supervivencia como creativo, incluidas las pestañas de cuadrícula del inventario creativo.`,
        'fr': `Lorsque la barre secondaire est sélectionnée, ouvrir votre inventaire ou n'importe quel conteneur (coffre, four, etc.) affiche vos objets dans leurs rangées d'origine, et un clic ou un clic-Maj agit sur l'objet que vous voyez. Cela fonctionne en solo et sur les serveurs, en survie comme en créatif, y compris les onglets de grille d'objets de l'inventaire créatif.`,
        'it': `Quando la hotbar secondaria è selezionata, aprire l'inventario o qualsiasi contenitore (cassa, fornace, ecc.) mostra i tuoi oggetti nelle righe originali, e un clic o clic con Maiusc agisce sull'oggetto che vedi. Funziona in single-player e sui server, sia in modalità sopravvivenza che creativa, incluse le schede a griglia di oggetti dell'inventario creativo.`,
        'ja': `副ホットバーが選択されている間、インベントリや任意のコンテナ（チェスト、かまどなど）を開くと、アイテムが元の行に表示され、クリックまたはShiftクリックは表示されているアイテムに作用します。これはシングルプレイとサーバー、サバイバルとクリエイティブの両モードで動作し、クリエイティブインベントリのアイテムグリッドタブにも対応しています。`,
        'ko': `보조 핫바가 선택된 상태에서 인벤토리나 상자, 화로 등 어떤 용기를 열어도 아이템이 원래 줄에 표시되며, 클릭 또는 Shift 클릭은 보이는 아이템에 적용됩니다. 이는 싱글 플레이어와 서버 모두, 생존 및 크리에이티브 모드 모두에서 작동하며, 크리에이티브 인벤토리의 아이템 그리드 탭도 포함합니다.`,
        'pt': `Enquanto a barra secundária estiver selecionada, abrir seu inventário ou qualquer contêiner (baú, fornalha etc.) mostra seus itens nas fileiras originais, e clicar ou Shift-clicar age sobre o item que você vê. Isso funciona no single-player e em servidores, tanto no modo sobrevivência quanto no criativo, incluindo as abas de grade do inventário criativo.`,
        'ru': `Когда выбрана вторичная панель, открытие инвентаря или любого контейнера (сундук, печь и т. д.) показывает предметы в их исходных рядах, а клик или клик с Shift действует на видимый предмет. Это работает в одиночной игре и на серверах, в режимах выживания и творчества, включая вкладки сетки предметов творческого инвентаря.`,
        'zh-cn': `选中副快捷栏时，打开物品栏或任意容器（箱子、熔炉等）会以原始行显示物品，点击或 Shift 点击作用于你看到的物品——适用于单人游戏和服务器、生存与创造模式（含创造物品栏的物品网格标签页）。`,
        'zh-tw': '選中副快捷欄時，打開物品欄或任意容器（箱子、熔爐等）會以原始行顯示物品，點擊或 Shift 點擊作用於你看到的物品——適用於單人遊戲和伺服器、生存與創造模式（含創造物品欄的物品網格標籤頁）。'
    },
    'requirements': {
        'de': `Anforderungen`,
        'en': `Requirements`,
        'es': `Requisitos`,
        'fr': `Configuration requise`,
        'it': `Requisiti`,
        'ja': `必要要件`,
        'ko': `요구 사항`,
        'pt': `Requisitos`,
        'ru': `Требования`,
        'zh-cn': `要求`,
        'zh-tw': '要求'
    },
    'requirements-optional': {
        'de': `Optional: <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a> fügt den Konfigurationsbildschirm im Spiel hinzu. <a href="https://modrinth.com/mod/cloth-config">Cloth Config</a> ist in der Mod-JAR enthalten.`,
        'en': `Optional: <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a> adds the in-game configuration screen. <a href="https://modrinth.com/mod/cloth-config">Cloth Config</a> is bundled in the mod jar.`,
        'es': `Opcional: <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a> añade la pantalla de configuración en el juego. <a href="https://modrinth.com/mod/cloth-config">Cloth Config</a> está incluido en el archivo del mod.`,
        'fr': `Facultatif : <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a> ajoute l'écran de configuration en jeu. <a href="https://modrinth.com/mod/cloth-config">Cloth Config</a> est inclus dans le jar du mod.`,
        'it': `Opzionale: <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a> aggiunge la schermata di configurazione in gioco. <a href="https://modrinth.com/mod/cloth-config">Cloth Config</a> è incluso nel jar della mod.`,
        'ja': `任意：<a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a> でゲーム内設定画面を追加できます。<a href="https://modrinth.com/mod/cloth-config">Cloth Config</a> はMODのJARに同梱されています。`,
        'ko': `선택 사항: <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a>는 게임 내 설정 화면을 추가합니다. <a href="https://modrinth.com/mod/cloth-config">Cloth Config</a>는 모드 JAR에 포함되어 있습니다.`,
        'pt': `Opcional: <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a> adiciona a tela de configuração no jogo. <a href="https://modrinth.com/mod/cloth-config">Cloth Config</a> está incluído no jar do mod.`,
        'ru': `Необязательно: <a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a> добавляет экран настройки в игре. <a href="https://modrinth.com/mod/cloth-config">Cloth Config</a> входит в jar мода.`,
        'zh-cn': `可选：<a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a> 提供游戏内配置界面。<a href="https://modrinth.com/mod/cloth-config">Cloth Config</a> 已内置在模组 jar 中。`,
        'zh-tw': '可選：<a href="https://www.curseforge.com/minecraft/mc-mods/modmenu">Mod Menu</a> 提供遊戲內設定畫面。<a href="https://modrinth.com/mod/cloth-config">Cloth Config</a> 已內建在模組 jar 中。'
    },
});
