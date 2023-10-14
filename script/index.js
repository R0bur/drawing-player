/*================================================*/
/* Графический исполнитель.                       */
/* Автор: Игорь Сергеевич Орещенков, 2020-2023 г. */
/* Язык программирования: JavaScript.             */
/*================================================*/
/*=============================================*/
/* Подготовка среды для выполнения приложения. */
/*=============================================*/
function init () {
	/*----------------------------------------------------------------*/
	/* Предзагрузка в кеш браузера мелодий музыкального сопровождения */
	/* с последующей настройкой аудиоплеера на автоматическое         */
	/* воспроизведение назначенной .src мелодии по готовности.        */
	/* Вызов: comingNext - функция, которую следует выполнить по      */
	/*        завершении настройки аудиоплеера.                       */
	/*----------------------------------------------------------------*/
	function soundCache (comingNext) {
		var s = "neutral,turn,hop,shshsh,beep,back,into,success,true,false,fail,step", i = 0,
		sources = s.split (",");
		function enumerateMelodies (e) {
			if (i < sources.length - 1)
				/* Перебор мелодий. */
				app.audio.src = "snd/" + sources[i++] + ".mp3";
			else {
				/* Заключительная настройка аудиоплеера. */
				app.audio.removeEventListener ("canplaythrough", enumerateMelodies);
				app.audio.addEventListener ("canplaythrough", function (e) {
					var promise = app.audio.play ();
					if (promise !== undefined)
						promise.then (_ => {}).catch (error => {/* window.alert ("DEBUG: audio player can't play sound!") */});
				});
				/* Передача управления следующей функции. */
				comingNext ();
			}		
		}
		app.audio.addEventListener ("canplaythrough", enumerateMelodies);
		app.audio.src = "snd/" + sources[i++] + ".mp3";
	}
	soundCache (start);
};
/*====================*/
/* Стартовая функция. */
/*====================*/
function start ()
{
	var sprite,
	elemBody = document.getElementsByTagName ("body")[0],
	elemMenubar = document.getElementById ("menubar"),
	elemModebar = document.getElementById ("modebar"),
	elemStatusbar = document.getElementById ("statusbar");
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
	function selectInterfaceLanguage ()
	{
		var qp = getQueryParameters (),
		lang1 = qp.lang? qp.lang: app.lang? app.lang: navigator.language,	/* предпочтительный язык */
		langs = i18n.languages (),	/* список доступных языков */
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
		app.title = i18n.string (1000);
		app.developed = i18n.string (1001) + app.developed;
		document.title = app.title;
		document.getElementById ("title").innerText = app.title;
	}
	/*-----------------------------------------*/
	/* Настройка режима воспроизведения звука. */
	/*-----------------------------------------*/
	function selectSoundMode ()
	{
		var qp = getQueryParameters ();
		if (qp.sound)
			/* Установка режима, переданного в строке запроса. */
			app.sound = qp.sound == "off" || qp.sound == "no"? 0:	/* без звука */
				qp.sound == "ext" || qp.sound == "adv"? 2:	/* расширенный набор звуков */
				1;						/* обычный набор звуков */
		if (app.sound == undefined)
			/* Установка режима по умолчанию, если ещё не установлен. */
			app.sound = 1;
		app.audio.muted = app.sound == 0;
		app.audio.autoplay = false;
	}
	/*-----------------------------------------------*/
	/* Воспроизведение мелодии.                      */
	/* Вызов: melody - название запрошенной мелодии. */
	/*-----------------------------------------------*/
	app.soundPlay = function (melody)
	{
		var fname;
		if (elemBody.className != "hidden" && app.audio) {
			switch (melody) {
				case "AppInit": /* инициализация приложения */
					fname = "snd/beep.mp3";
					break;
				case "SwitchMode": /* смена режима: интерактивный, программирование, выполнение */
					fname = "snd/shshsh.mp3";
					break;
				case "Step": /* выполнение команды "шаг" */
					fname = "snd/step.mp3";
					break;
				case "Hop": /* выполнение команды "прыжок" */
					fname = "snd/hop.mp3";
					break;
				case "Turn": /* выполнение команды "поворот" */
					fname = "snd/turn.mp3";
					break;
				case "True": /* результат проверки - истина */
					fname = app.sound == 2? "snd/true.mp3": "snd/neutral.mp3";
					break;
				case "False": /* результат проверки - ложь */
					fname = app.sound == 2? "snd/false.mp3": "snd/neutral.mp3";
					break;
				case "Into": /* переход к процедуре */
					fname = app.sound == 2? "snd/into.mp3": "snd/neutral.mp3";
					break;
				case "Back": /* возврат из процедуры или завершение цикла */
					fname = app.sound == 2? "snd/back.mp3": "snd/neutral.mp3";
					break;
				case "Neutral": /* звук выполнения нейтральной команды */
					fname = "snd/neutral.mp3";
					break;
				case "Fail": /* завершение программы с ошибкой */
					fname = "snd/fail.mp3";
					break;
				case "Success": /* успешное завершение программы*/
					fname = "snd/success.mp3";
					break;
				default:
					fname = "snd/neutral.mp3";
			}
			app.audio.src = fname;
			/* Воспроизведение мелодии начинается автоматически по готовности плеера. */
			/* Обработка события установлена выше в init () { soundCache () { ... }}. */
		}
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
			/* Звуковое сопровождение ошибочной ситуации. */
			app.soundPlay ("Fail");
			/* Сообщение о возникшей ошибочной ситуации. */
			menubar.replace (actions);
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
		app.soundPlay ("SwitchMode");
		player.reset ();
	}
	function doReset1 ()
	{
		player.reset ();
		switchMode1 ();
	}
	function doReset3 ()
	{
		player.reset ();
		switchMode3 ();
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
		menubar.replace (app.modes[mode]);
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
		app.soundPlay ("SwitchMode");
		switchMode (elemMenubar, 0, false, i18n.string (4), i18n.string (5) + "\n" + i18n.string (6));
	}
	/*------------------------------------*/
	/* Включение режима программирования. */
	/*------------------------------------*/
	function switchMode2 () {
		app.soundPlay ("SwitchMode");
		switchMode (elemMenubar, 1, true, i18n.string (7), i18n.string (8) + "\n" + i18n.string (9));
	}
	/*----------------------------------------*/
	/* Включение режима выполнения программы. */
	/*----------------------------------------*/
	function switchMode3 () {
		app.soundPlay ("SwitchMode");
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
			if (program.error) {
				/* Звуковое сопровождение завершения программы с ошибкой. */
				app.soundPlay ("Fail");
				/* Отображение информации о результате выполнения программы. */
				switchMode (elemMenubar, 2, false, "", "-" + program.getErrorMessage ());
			}
			else {
				/* Звуковое сопровождение успешного завершения программы. */
				app.soundPlay ("Success");
				/* Отображение информации о результате выполнения программы. */
				switchMode (elemMenubar, 2, false, "", i18n.string (12) + "\n" +
				i18n.string (13, program.counters[0], program.counters[1], program.counters[2]) + "\n" +
				i18n.string (14, program.counters[0] + program.counters[1] + program.counters[2]));
			}
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
		menubar.replace (actions);
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
				menubar.replace (app.modes[1]);
			}
			/*--------------------------------------------*/
			/* Ввод завершения "... впереди не край, то". */
			/*--------------------------------------------*/
			function ediIfNotEdge ()
			{
				editor.insert (i18n.string (29) + "\n");
				menubar.replace (app.modes[1]);
			}
			endings = [
				{hotkey: "F1", text: i18n.string (30), handler: ediIfEdge},
				{hotkey: "F2", text: i18n.string (31), handler: ediIfNotEdge}
			];
			editor.insert (i18n.string (32));
			menubar.replace (endings);
		}
		/*-----------------------*/
		/* Ввод команды "иначе". */
		/*-----------------------*/
		function ediElse ()
		{
			editor.insert (i18n.string (33) + "\n");
			menubar.replace (app.modes[1]);			
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
				menubar.replace (app.modes[1]);
			}
			/*---------------------------------------------------*/
			/* Ввод завершения "... впереди не край, повторять". */
			/*---------------------------------------------------*/
			function ediWhileNotEdge ()
			{
				editor.insert (i18n.string (35) + "\n");
				menubar.replace (app.modes[1]);
			}
			endings = [
				{hotkey: "F1", text: i18n.string (36), handler: ediWhileEdge},
				{hotkey: "F2", text: i18n.string (37), handler: ediWhileNotEdge}
			];
			editor.insert (i18n.string (38));
			menubar.replace (endings);
		}
		/*------------------------*/
		/* Ввод команды "сделай". */
		/*------------------------*/
		function ediDo ()
		{
			editor.insert (i18n.string (39));
			menubar.replace (app.modes[1]);
		}
		/*---------------------------*/
		/* Ввод команды "процедура". */
		/*---------------------------*/
		function ediProc ()
		{
			editor.insert (i18n.string (40));
			menubar.replace (app.modes[1]);
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
				menubar.replace (app.modes[1]);
			}
			/*------------------------------*/
			/* Ввод завершения "... цикла". */
			/*------------------------------*/
			function ediEndWhile ()
			{
				editor.insert (i18n.string (42) + "\n");
				menubar.replace (app.modes[1]);
			}
			function ediEndProc ()
			{
				editor.insert (i18n.string (43) + "\n");
				menubar.replace (app.modes[1]);
			}
			endings = [
				{hotkey: "F1", text: i18n.string (44), handler: ediEndIf},
				{hotkey: "F2", text: i18n.string (45), handler: ediEndWhile},
				{hotkey: "F3", text: i18n.string (46), handler: ediEndProc}
			];
			editor.insert (i18n.string (47));
			menubar.replace (endings);
		}
		/*----------------------------------------*/
		/* Возврат в основной режим ввода команд. */
		/*----------------------------------------*/
		function ediBack ()
		{
			menubar.replace (app.modes[1]);
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
		menubar.replace (commands);
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
	/*-------------------------------------------*/
	/* Установка обработчика нажатий на клавиши. */
	/*-------------------------------------------*/
	function setKeybindings ()
	{
		var reFKeys = /^F(?:[1-9]|1[012])$/, body = document.getElementsByTagName ("body")[0];
		/* Установка обработчика событий от клавиатуры. */
		body.onkeydown = function (event) {
			var result = !reFKeys.test (event.key), i, key = event.key.substring (0, 3).toUpperCase ();
			/* Обработка привязок к пунктам горизонтального меню. */
			for (i in menubar.items)
				if (key == menubar.items[i].hotkey) {
					if (app.userinput)
						menubar.items[i].handler ();
					result = false;
					break;
				}
			/* Обработка других привязок. */
			if (result && event.code == "KeyA" && event.altKey && !event.shiftKey && !event.ctrlKey) {
				/* Отображение информации о продукте и авторе. */
				displayAboutBox ();
				result = false;
			}
			if (result && event.code == "KeyS" && event.altKey && !event.shiftKey && !event.ctrlKey) {
				/* Включение/выключение звукового сопровождения. */
				switchSound ();
				result = false;
			}
			return result;
		}
	}
	/*---------------------------------------------------------------*/
	/* Обновление строки состояния.                                  */
	/* Вызов: elem - элемент-контейнер HTMLElement строки состояния. */
	/*---------------------------------------------------------------*/
	function updateStatusbar (elem)
	{
		var ea, ek, ev, p1, p2, txtSound = i18n.string (71, "Alt+s"), txtNorm = i18n.string (72), txtAdv = i18n.string (73), txtOff = i18n.string (74),
			txtSoundBeg, txtSoundHotkey, txtSoundEnd;
		p1 = txtSound.indexOf ("[");
		p2 = txtSound.indexOf ("]");
		if (p1 > 0 && p2 > p1) {
			txtSoundBeg = txtSound.substr (0, p1);
			txtSoundHotkey = txtSound.substr (p1, p2 - p1 + 1);
			txtSoundEnd = txtSound.substr (p2 + 1) + " ";
		}
		else {
			txtSoundBeg = txtSound;
			txtSoundHotkey = "[?]";
			txtSoundEnd = " ";
		}
		ea = document.createElement ("a");
		ea.href = "#";
		ea.onclick = function () { switchSound (); return false; };
		ea.appendChild (document.createTextNode (txtSoundBeg));
		ek = document.createElement ("span");
		ek.className = "hotkey";
		ek.appendChild (document.createTextNode (txtSoundHotkey));
		ea.appendChild (ek);
		ea.appendChild (document.createTextNode (txtSoundEnd));
		ev = document.createElement ("var");
		ev.appendChild (document.createTextNode (app.sound == 1? txtNorm: app.sound == 2? txtAdv: txtOff));
		ea.appendChild (ev);
		/* Удаление старого содержимого и установка нового. */
		while (elem.firstChild)
			elem.removeChild (elem.lastChild);
		elem.appendChild (ea);
	}
	/*-----------------------------------------------*/
	/* Включение/выключение звукового сопровождения. */
	/*-----------------------------------------------*/
	function switchSound ()
	{
		if (app.audio) {
			app.sound = (app.sound + 1) % 3;
			app.audio.muted = app.sound == 0;
			app.soundPlay ("AppInit");
			updateStatusbar (elemStatusbar);
		}
	}
	/*--------------------------------------------*/
	/* Отображение информации о продукте и авторе.*/
	/*--------------------------------------------*/
	function displayAboutBox ()
	{
		var appInfo = i18n.string (1002) + app.title + ", " + i18n.string (1003) + app.version,
		devInfo = i18n.string (1004) + app.developed;
		app.soundPlay ("AppInit");
		window.setTimeout (function () {window.alert (appInfo + "\n" + devInfo)}, 100);
	}
	/*-------------------------------------*/
	/* Исполняеме команды функции Start... */
	/*-------------------------------------*/
	selectInterfaceLanguage ();
	selectSoundMode ();
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
		{hotkey: "ESC", text: i18n.string (69), handler: doReset3},
		{hotkey: "TAB", text: i18n.string (70), handler: switchMode1}
	]
	];
	app.userinput = false;
	player.init ();
	menubar.init (document.getElementById ("menubar"));
	board.init (document.getElementById ("board"), 301, 381, 20, 20);
	boardptr.init (board, "img/sprite.gif", 24, 24);
	editor.init (document.getElementById ("editor").firstChild);
	bulletin.init (document.getElementById ("bulletin"));
	player.reset ();
	/* createMenubar (document.getElementById ("menubar"), app.modes[app.mode]); */
	switch (app.mode) {
		case 1: switchMode2 ();
			break;
		case 2: switchMode3 ();
			break;
		default: switchMode1 ();
	}
	updateStatusbar (elemStatusbar);
	setKeybindings ();
	window.onresize = wndResize;
	/* Теперь, когда всё настроено, можно отобразить экран приложения, */
	/* убрав класс "hidden" у элемента "body".                         */
	elemBody.className = "";
}
