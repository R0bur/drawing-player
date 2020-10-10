/*===========================================*/
/* Графический исполнитель.                  */
/* Автор: Игорь Сергеевич Орещенков, 2020 г. */
/* Язык программирования: JavaScript.        */
/*===========================================*/
app = new Object ();	/* Объект для хранения состояния приложения. */
/*====================*/
/* Стартовая функция. */
/*====================*/
function start ()
{
	var sprite,
	elemMenubar = document.getElementById ("menubar"),
	elemModebar = document.getElementById ("modebar");
	/*-----------------------------------------------------------------*/
	/* Получение параметров GET-запроса.                               */
	/* Возврат: объект со свойствами "ИмяПараметра:ЗначениеПараметра". */
	/*-----------------------------------------------------------------*/
	function getQueryParameters ()
	{
		var q = unescape (location.search), pairs, i, pair, p, k, v, o = new Object ();
		pairs = q.substr (1).split ("&");
		for (i = 0; i < pairs.length; i++) {
			pair = pairs[i]
			p = pair.indexOf ("=");
			if (p > 0) {
				k = pair.substr (0, p);
				v = pair.substr (p + 1)
				o[k] = v;
			}
			else
				o[pair] = "";
		}
		return o;
	}
	/*------------------------------------------*/
	/* Настройка языка общения с пользователем. */
	/*------------------------------------------*/
	function selectInterfaceLanguage () {
		var qp = getQueryParameters (),
		lang1 = qp.lang? qp.lang: navigator.language,	/* предпочтительный язык */
		langs = i18n.languages (),			/* список доступных языков */
		lang = "??", i;
		/* Выбор языка. */
		for (i = 0; i < langs.length; i++)
			if (lang1 == langs[i])
				/* Выбирается предпочтительный язык. */
				lang = lang1;
		/* Настройка приложения на работу с выбранным языком. */
		if (lang != "??")
			i18n.language = lang;
		if (typeof i18n.strTable[i18n.language] == "string")
			i18n.language = i18n.strTable[i18n.language];
		program.language = i18n.plTree[i18n.language];
		document.documentElement.setAttribute ("lang", i18n.language);
		document.getElementById ("title").innerText = i18n.string (1000);
	}
	/*-------------------------------------*/
	/* Разрешение пользовательского ввода. */
	/*-------------------------------------*/
	function enableUserInput ()
	{
		app.userinput = true;
	}
	/*---------------------------------*/
	/* Запрет пользовательского ввода. */
	/*---------------------------------*/
	function disableUserInput ()
	{
		app.userinput = false;
	}
	/*---------------------------------------------------*/
	/* Проверка состояния исполнителя после перемещения. */
	/*---------------------------------------------------*/
	function afterMove ()
	{
		var actions = [{hotkey: "ESC", text: i18n.string (1), handler: doReset1}];
		if (player.e) {
			createMenubar (elemMenubar, actions);
			bulletin.placeError (i18n.string (2) + "\n" + i18n.string (3));
		}
		enableUserInput ();
	}
	/*-------------------------------*/
	/* Выполнение шага исполнителем. */
	/*-------------------------------*/
	function doStep ()
	{
		disableUserInput ();
		player.walk (true, afterMove, 0);
	}
	/*---------------------------------*/
	/* Выполнение прыжка исполнителем. */
	/*---------------------------------*/
	function doJump ()
	{
		disableUserInput ();
		player.walk (false, afterMove, 0);
	}
	/*-----------------------------------*/
	/* Выполнение поворота исполнителем. */
	/*-----------------------------------*/
	function doTurn ()
	{
		disableUserInput ();
		player.turn (enableUserInput, 0);
	}
	/*-------------------------------------------------------------------------*/
	/* Возврат исполнителя в исходное состояние и очистка доски для рисования. */
	/*-------------------------------------------------------------------------*/
	function doReset ()
	{
		player.reset ();
	}
	function doReset1 ()
	{
		player.reset ();
		switchMode1 ();
	}
	/*------------------------------------------------*/
	/* Переключение режима работы программы.          */
	/* Вызов: elem - HTML-элемент строки меню,        */
	/*        mode - номер режима,                    */
	/*        fe - признак доступности редактора,     */
	/*        title - заголовок нового режима,        */
	/*        description - описание нового режима.   */
	/*------------------------------------------------*/
	function switchMode (elem, mode, fe, title, description) {
		app.userinput = false;
		editor.enable (fe);
		createMenubar (elem, app.modes[mode]);
		if (title != "")
			elemModebar.innerText = title;
		if (description != "")
			if (description.charAt (0) == "+")
				bulletin.placeSuccess (description.substring (1, description.length));
			else if (description.charAt (0) == "-")
				bulletin.placeError (description.substring (1, description.length));
			else
				bulletin.placeInfo (description);
		app.userinput = true;
		app.mode = mode;
	}
	/*-------------------------------------------------------*/
	/* Включение режима непосредственного выполнения команд. */
	/*-------------------------------------------------------*/
	function switchMode1 () {
		switchMode (elemMenubar, 0, false, i18n.string (4), i18n.string (5) + "\n" + i18n.string (6));
	}
	/*------------------------------------*/
	/* Включение режима программирования. */
	/*------------------------------------*/
	function switchMode2 () {
		switchMode (elemMenubar, 1, true, i18n.string (7), i18n.string (8) + "\n" + i18n.string (9));
	}
	/*----------------------------------------*/
	/* Включение режима выполнения программы. */
	/*----------------------------------------*/
	function switchMode3 () {
		switchMode (elemMenubar, 2, false, i18n.string (10), i18n.string (11));
	}
	/*---------------------------------------------------*/
	/* Запуск программы на исполнение.                   */
	/* Вызов: mode - режим выполнения программы,         */
	/*        0 - обычный, 1 - результат, 2 - отладка,   */
	/*        3 - продолжение выполнения после отладки,  */
	/*        4 - переход в режим отладки из выполнения. */
	/*---------------------------------------------------*/
	function prgStart (mode)
	{
		var actions, msg;
		/*---------------------------------------------------------*/
		/* Функция, выполняемая после завершения работы программы. */
		/*---------------------------------------------------------*/
		function prgDone ()
		{
			if (program.error)
				switchMode (elemMenubar, 2, false, "", "-" + program.getErrorMessage ());
			else
				switchMode (elemMenubar, 2, false, "", i18n.string (12) + "\n" +
				i18n.string (13, program.counters[0], program.counters[1], program.counters[2]) + "\n" +
				i18n.string (14, program.counters[0] + program.counters[1] + program.counters[2]));
		}
		/*----------------------------------*/
		/* Прерывание выполнения программы. */
		/*----------------------------------*/
		function prgBreak ()
		{
			if (!program.error)
				program.error = {
					message: i18n.string (15),
					found: i18n.string (16),
					expected: "",
					position: -1
				};
		}
		/*---------------------------------------------------------*/
		/* Переход из режима выполнения программы в режим отладки. */
		/*---------------------------------------------------------*/
		function prgDebug () {
			program.turnDebugOn ();
			prgStart (4);
		}
		/*---------------------------------------------------*/
		/* Прерывание выполнения программы в режиме отладки. */
		/*---------------------------------------------------*/
		function dbgBreak ()
		{
			switchMode (elemMenubar, 2, false, "", i18n.string (17));
		}
		/*---------------------------------------------------------------------*/
		/* Переход из режима отладки в режим нормального выполнения программы. */
		/*---------------------------------------------------------------------*/
		function dbgContinue ()
		{
			prgStart (3);
		}
		/*------------------------------------------------*/
		/* Выполнение очередной команды в режиме отладки. */
		/*------------------------------------------------*/
		function dbgNextCommand ()
		{
			disableUserInput ();
			program.executeCommand (prgDone, enableUserInput);
		}
		if (mode != 2 && mode != 4) {
			actions = [
				{hotkey: "F1", text: i18n.string (18), handler: prgBreak},
				{hotkey: "F2", text: i18n.string (19), handler: prgDebug},
			];
			msg = i18n.string (20);
		}
		else {
			actions = [
				{hotkey: "F1", text: i18n.string (21), handler: dbgBreak},
				{hotkey: "F2", text: i18n.string (22), handler: dbgContinue},
				{hotkey: "F3", text: i18n.string (23), handler: dbgNextCommand}
			];
			msg = i18n.string (24);
		}
		createMenubar (elemMenubar, actions);
		bulletin.placeInfo (msg);
		if (mode < 3)
			program.start (mode, prgDone);
		else if (mode == 3)
			program.continueExecution (prgDone);
	}
	/*----------------------------------------*/
	/* Выполнение программы в обычном режиме. */
	/*----------------------------------------*/
	function prgStartNormal ()
	{
		prgStart (0);
	}
	/*--------------------------------------------------*/
	/* Отладка программы (режим пошагового выполнения). */
	/*--------------------------------------------------*/
	function prgDebug ()
	{
		prgStart (2);
	}
	/*-----------------------------------------------------------*/
	/* Получение окончательного результата выполнения программы. */
	/*-----------------------------------------------------------*/
	function prgFinalResult ()
	{
		prgStart (1);
	}
	/*------------------------*/
	/* Ввод команды "прыжок". */
	/*------------------------*/
	function ediJump ()
	{
		editor.insert (i18n.string (25) + "\n");
	}
	/*---------------------*/
	/* Ввод команды "шаг". */
	/*---------------------*/
	function ediStep ()
	{
		editor.insert (i18n.string (26) + "\n");
	}
	/*-------------------------*/
	/* Ввод команды "поворот". */
	/*-------------------------*/
	function ediTurn ()
	{
		editor.insert (i18n.string (27) + "\n");
	}
	/*-----------------------------*/
	/* Ввод дополнительных команд. */
	/*-----------------------------*/
	function ediCommands ()
	{
		var commands;
		/*-------------------------*/
		/* Ввод команды "если...". */
		/*-------------------------*/
		function ediIf ()
		{
			var endings;
			/*----------------------------------------*/
			/* Ввод завершения "...впереди край, то". */
			/*----------------------------------------*/
			function ediIfEdge ()
			{
				editor.insert (i18n.string (28) + "\n");
				createMenubar (elemMenubar, app.modes[1]);
			}
			/*--------------------------------------------*/
			/* Ввод завершения "... впереди не край, то". */
			/*--------------------------------------------*/
			function ediIfNotEdge ()
			{
				editor.insert (i18n.string (29) + "\n");
				createMenubar (elemMenubar, app.modes[1]);
			}
			endings = [
				{hotkey: "F1", text: i18n.string (30), handler: ediIfEdge},
				{hotkey: "F2", text: i18n.string (31), handler: ediIfNotEdge}
			];
			editor.insert (i18n.string (32));
			createMenubar (elemMenubar, endings);
		}
		/*-----------------------*/
		/* Ввод команды "иначе". */
		/*-----------------------*/
		function ediElse ()
		{
			editor.insert (i18n.string (33) + "\n");
			createMenubar (elemMenubar, app.modes[1]);			
		}
		/*-------------------------*/
		/* Ввод команды "пока...". */
		/*-------------------------*/
		function ediWhile ()
		{
			var endings;
			/*------------------------------------------------*/
			/* Ввод завершения "... впереди край, повторять". */
			/*------------------------------------------------*/
			function ediWhileEdge ()
			{
				editor.insert (i18n.string (34) + "\n");
				createMenubar (elemMenubar, app.modes[1]);
			}
			/*---------------------------------------------------*/
			/* Ввод завершения "... впереди не край, повторять". */
			/*---------------------------------------------------*/
			function ediWhileNotEdge ()
			{
				editor.insert (i18n.string (35) + "\n");
				createMenubar (elemMenubar, app.modes[1]);
			}
			endings = [
				{hotkey: "F1", text: i18n.string (36), handler: ediWhileEdge},
				{hotkey: "F2", text: i18n.string (37), handler: ediWhileNotEdge}
			];
			editor.insert (i18n.string (38));
			createMenubar (elemMenubar, endings);
		}
		/*------------------------*/
		/* Ввод команды "сделай". */
		/*------------------------*/
		function ediDo ()
		{
			editor.insert (i18n.string (39));
			createMenubar (elemMenubar, app.modes[1]);
		}
		/*---------------------------*/
		/* Ввод команды "процедура". */
		/*---------------------------*/
		function ediProc ()
		{
			editor.insert (i18n.string (40));
			createMenubar (elemMenubar, app.modes[1]);
		}
		/*--------------------------*/
		/* Ввод команды "конец...". */
		/*--------------------------*/
		function ediEnd ()
		{
			var endings;
			/*----------------------------------*/
			/* Ввод завершения "... ветвления". */
			/*----------------------------------*/
			function ediEndIf ()
			{
				editor.insert (i18n.string (41) + "\n");
				createMenubar (elemMenubar, app.modes[1]);
			}
			/*------------------------------*/
			/* Ввод завершения "... цикла". */
			/*------------------------------*/
			function ediEndWhile ()
			{
				editor.insert (i18n.string (42) + "\n");
				createMenubar (elemMenubar, app.modes[1]);
			}
			function ediEndProc ()
			{
				editor.insert (i18n.string (43) + "\n");
				createMenubar (elemMenubar, app.modes[1]);
			}
			endings = [
				{hotkey: "F1", text: i18n.string (44), handler: ediEndIf},
				{hotkey: "F2", text: i18n.string (45), handler: ediEndWhile},
				{hotkey: "F3", text: i18n.string (46), handler: ediEndProc}
			];
			editor.insert (i18n.string (47));
			createMenubar (elemMenubar, endings);
		}
		/*----------------------------------------*/
		/* Возврат в основной режим ввода команд. */
		/*----------------------------------------*/
		function ediBack ()
		{
			createMenubar (elemMenubar, app.modes[1]);
		}
		commands = [
			{hotkey: "F4", text: i18n.string (48), handler: ediIf},
			{hotkey: "F5", text: i18n.string (49), handler: ediElse},
			{hotkey: "F6", text: i18n.string (50), handler: ediWhile},
			{hotkey: "F7", text: i18n.string (51), handler: ediDo},
			{hotkey: "F8", text: i18n.string (52), handler: ediProc},
			{hotkey: "F9", text: i18n.string (53), handler: ediEnd},
			{hotkey: "F10", text: i18n.string (54), handler: ediBack}
		];
		createMenubar (elemMenubar, commands);
	}
	/*-------------------------------*/
	/* Очистка текстового редактора. */
	/*-------------------------------*/
	function ediClean ()
	{
		disableUserInput ();
		if (window.confirm (i18n.string (55)))
			editor.clean ();
		enableUserInput (); 
	}
	/*--------------------------------------------------------------------------*/
	/* Позиционирование исполнителя после изменения размеров окна веб-браузера. */
	/*--------------------------------------------------------------------------*/
	function wndResize ()
	{
		player.display (false);
		boardptr.windowresize ();
		player.display (true);
	}
	selectInterfaceLanguage ();
	app.modes = [
	/* 0 - Режим непосредственного выполнения команд. */
	[
		{hotkey: "F1", text: i18n.string (56), handler: doJump},
		{hotkey: "F2", text: i18n.string (57), handler: doStep},
		{hotkey: "F3", text: i18n.string (58), handler: doTurn},
		{hotkey: "ESC", text: i18n.string (59), handler: doReset},
		{hotkey: "TAB", text: i18n.string (60), handler: switchMode2}
	],
	/* 1 - Режим программирования. */
	[
		{hotkey: "F1", text: i18n.string (61), handler: ediJump},
		{hotkey: "F2", text: i18n.string (62), handler: ediStep},
		{hotkey: "F3", text: i18n.string (63), handler: ediTurn},
		{hotkey: "F4", text: "…", handler: ediCommands},
		{hotkey: "ESC", text: i18n.string (64), handler: ediClean},
		{hotkey: "TAB", text: i18n.string (65), handler: switchMode3}
	],
	/* 2 - Режим выполнения программы. */
	[
		{hotkey: "F1", text: i18n.string (66), handler: prgStartNormal},
		{hotkey: "F2", text: i18n.string (67), handler: prgDebug},
		{hotkey: "F5", text: i18n.string (68), handler: prgFinalResult},
		{hotkey: "ESC", text: i18n.string (69), handler: doReset},
		{hotkey: "TAB", text: i18n.string (70), handler: switchMode1}
	]
	];
	app.mode = 0;
	app.userinput = false;
	player.init ();
	board.init (document.getElementById ("board"), 301, 381, 20, 20);
	boardptr.init (board, "img/sprite.gif", 24, 24);
	editor.init (document.getElementById ("editor").firstChild);
	bulletin.init (document.getElementById ("bulletin"));
	player.reset ();
	createMenubar (document.getElementById ("menubar"), app.modes[app.mode]);
	switchMode1 ();
	window.onresize = wndResize;
}