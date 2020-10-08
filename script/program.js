/*=====================*/
/* Объект - программа. */
/*=====================*/
var program = new Object ();
/*================================*/
/* Дерево языка программирования. */
/*================================*/
program.language = null;	/* дерево определяется в соответствии с языком интерфейса */
/*==================================================================*/
/* Интерпретация строки программы.                                  */
/* Обрабатывается строка this.atext[this.ip].                       */
/* При отсутствии ошибок this.error == null, а в this.command       */
/* записывается объект, содержащий сведения о распознанной команде. */
/* В случае обнаружения ошибки this.command == null, а информация о */
/* ней записывается в this.error.                                   */
/*==================================================================*/
program.interpretate = function () {
	var branch = this.language, stop = false, whiteSpaces = " \t",
	line = this.atext[this.ip], n = line.length,
	p1, p2 = 0, i, s, v, cmd = {code: undefined, args: []};
	/*----------------------------------------------------------------------*/
	/* Пропуск символов в строке.                                           */
	/* Вызов: p - стартовая позиция,                                        */
	/*        s - обрабатываемая строка,                                    */
	/*        t - строка с образцами символов,                              */
	/*        m - режим пропуска символов:                                  */
	/*            true - пропускаются символы, соответствующие образцу,     */
	/*            false - пропускаются символы, не соответствующие образцу. */
	/* Возврат: позиция, следующая за пропущенными символами.               */
	/*----------------------------------------------------------------------*/
	function skipOver (p, s, t, m) {
		var n = s.length;
		while (p < n && t.indexOf (s.charAt (p)) >= 0 == m)
			p++;
		return p;
	}
	this.command = null;	/* результат интерпретации команды */
	/* Цикл перебора лексем строки программы. */
	do {
		/* Определение очередной лексемы. */
		p1 = skipOver (p2, line, whiteSpaces, true);
		p2 = skipOver (p1, line, whiteSpaces, false);
		s = line.substring (p1, p2);
		/* Проверка найденной лексемы на соответствие правилам языка. */
		stop = true;
		if (s == "")
			cmd.code = 0;	/* пустая команда */
		else
			for (i in branch) {
				if (i.charAt (0) == "!")
					cmd.args.push (s);
				else if (i != s)
					continue;
				/* Обработка обнаруженного узла как промежуточного или концевого. */
				if (typeof (branch[i]) == "object") {
					/* Переход к дочернему узлу. */
					branch = branch[i];
					stop = false;
				}
				else
					/* Команда идентифицирована. */
					cmd.code = branch[i];
				break;
			}
	} while (p2 < n && !stop);
	/* Проверка результата интерпретации. */
	if (cmd.code == undefined) {
		/* Ошибка: команда не была идентифицирована. */
		v = [];
		for (i in branch)
			v.push (i);
		this.error = {
			message: i18n.string (101),
			found: (stop? s: i18n.string (102)),
			expected: "{" + v.join (",") + "}",
			position: p1
		};
	}
	else {
		/* Команда была идентифицирована. Проверка оставшейся части строки. */
		p1 = skipOver (p2, line, whiteSpaces, true);
		if (p1 < n) {
			/* Ошибка: в конце строки имеется текст, не относящийся к команде. */
			this.error = {
				message: i18n.string (101),
				found: line.substring (p1, n),
				expected: i18n.string (102),
				position: p1
			};
		}
		else
			this.command = cmd;
	}
};
/*======================================================*/
/* Метод объекта "программа" - начало исполнения.       */
/* Вызов: mode - режим выполнения программы,            */
/*        0 - обычный, 1 - результат, 2 - отладка,      */
/*        done - функция, которая должна быть выполнена */
/*               по завершении программы.               */
/*======================================================*/
program.start = function (mode, done)
{
	var i, a = [];
	/* Получение текста программы из редактора. */
	this.atext = editor.elem.value.split ("\n");
	/* Построение таблицы процедур. */
	this.ip = 0;
	this.proc = new Object ();
	this.stack = new Array ();
	while (this.ip < this.atext.length) {
		this.interpretate ();
		if (this.command && this.command.code == 9)
			this.proc[this.command.args[0]] = this.ip;
		this.ip++;
	}
	/* Инициализация устройства исполнения. */
	this.mode = mode;		/* режим выполнения программы */
	this.ip = 0;			/* счётчик команд */
	this.counters = new Array (0, 0, 0); /* счётчики действий */
	this.stack = new Array ();	/* стек */
	this.stackCapacity = 100;	/* ёмкость стека */
	this.error = null;		/* объект с информацией об ошибке */
	this.command = null;		/* объект с информацией о команде */
	this.timeout = 500;		/* временной интервал между командами, миллисекунд */
	this.active = true;		/* признак необходимости выполнения команд */
	/* Выключение отображения исполнителя в быстром режиме. */
	if (mode == 1)
		player.display (false);
	/* Запуск процесса выполнения программы с первой команды. */
	if (this.ip < this.atext.length) {
		/* Подсвечивание очередной строки в редакторе. */
		if (this.active && this.mode != 1)
			editor.selectLine (this.ip, this.atext.length);
		/* Выполнение первой команды. */
		if (this.mode != 2)
			this.executeCommand (done);
	}
	else
		done ();
};
/*================================================================*/
/* Метод объекта "программа" - выполнение очередной команды.      */
/* Вызов: done - функция, выполняемая после завершения программы, */
/*        imdone - функция, выполняемая после завершения команды. */
/* Если при интерпретации команды или в ходе её выполнения        */
/* происходит ошибка, то информация о ней записывается в объект   */
/* this.error и выполняется функция завершения. В случае          */
/* успешного исполнения команды  счётчик команд this.ip           */
/* получает номер следующей команды, которая планируется к        */
/* исполнению по таймеру.                                         */
/*================================================================*/
program.executeCommand = function (done, imdone)
{
	var o = this, topOfStack;
	/*----------------------------------------------------------------------*/
	/* Выполнение заключительных действий перед вызовом функции завершения. */
	/*----------------------------------------------------------------------*/
	function preDone ()
	{
		/* Подсвечивание последней строки или строки, содержащей ошибку. */
		editor.selectLine (o.ip, o.atext.length);
		/* После завершения работы программы стек должен быть пустым. */
		topOfStack = o.stack.length? o.stack[o.stack.length - 1]: null;
		if (!o.error && topOfStack) {
			o.error = {
				message: i18n.string (103),
				found: i18n.string (104,
					topOfStack.code == 1 || topOfStack.code == 2? i18n.string (105):
					topOfStack.code == 4 || topOfStack.code == 5? i18n.string (106): i18n.string (107)
				),
				expected: "",
				position: -1
			};
			o.ip++;
		}
		/* Восстановление отображения исполнителя в быстром режиме. */
		if (o.mode == 1)
			player.display (true);
		/* Выполнение функции завершения. */
		done ();
	}
	/*--------------------------------------------*/
	/* Планирование выполнения очередной команды. */
	/* Используются переменные контекста:         */
	/* o - объект "программа",                    */
	/* done - функция завершения.                 */
	/*--------------------------------------------*/
	function planNextCommand () {
		/* Проверка состояния исполнителя. */
		if (player.e)
			o.error = {
				message: i18n.string (108),
				found: "",
				expected: "",
				position: -1
			};
		/* Планирование дальнейшей работы. */
		if (!o.error && o.ip < o.atext.length - 1) {
			o.ip++;
			/* Подсвечивание очередной строки программы в редакторе. */
			if (o.active && o.mode != 1)
				editor.selectLine (o.ip, o.atext.length);
			/* Планирование выполнения очередной строки программы. */
			if (!o.active || o.mode != 2)
				setTimeout (function () { o.executeCommand (done, imdone); }, o.active && o.mode == 0? o.timeout: 1);
			else if (imdone)
				imdone ();
		}
		else
			/* Завершение выполнения программы. */
			preDone ();
	}
	/* Интерпретация команды. */
	this.interpretate ();
	/* Исполнение команды. */
	if (!this.error) {
		switch (this.command.code) {
		case -1: /* прыжок */
			if (this.active) {
				if (this.mode == 1)
					/* Быстрый режим выполнения. */
					player.quickWalk (false, planNextCommand);
				else
					/* Обычный режим выполнения или режим отладки. */
					player.walk (false, planNextCommand, 0);
				/* Учёт выполненного прыжка. */
				this.counters[0]++;
			}
			else
				planNextCommand ();
			break;
		case -2: /* шаг */
			if (this.active) {
				if (this.mode == 1)
					/* Быстрый режим выполнения. */
					player.quickWalk (true, planNextCommand);
				else
					/* Обычный режим выполнения или режим отладки. */
					player.walk (true, planNextCommand, 0);
				/* Учёт выполненного шага. */
				this.counters[1]++;
			}
			else
				planNextCommand ();
			break;
		case -3: /* поворот */
			if (this.active) {
				if (this.mode == 1)
					/* Быстрый режим выполнения. */
					player.quickTurn (planNextCommand);
				else
					/* Обычный режим выполнения или режим отладки. */
					player.turn (planNextCommand, 0);
				/* Учёт выполненного поворота. */
				this.counters[2]++;
			}
			else
				planNextCommand ();
			break;
		case 1: /* если впереди край, то */
			if (this.stack.length < this.stackCapacity) {
				this.stack.push ({code: this.command.code, ip: this.ip, active: this.active});
				this.active = this.active && player.queryEdgeAhead ();
			}
			else
				/* Ошибка: переполнение стека. */
				this.error = {
					message: i18n.string (103),
					found: i18n.string (109),
					expected: "",
					position: -1
				};
			planNextCommand (done);
			break;
		case 2: /* если впереди не край, то */
			if (this.stack.length < this.stackCapacity) {
				this.stack.push ({code: this.command.code, ip: this.ip, active: this.active});
				this.active = this.active && !player.queryEdgeAhead ();
			}
			else
				/* Ошибка: переполнение стека. */
				this.error = {
					message: i18n.string (103),
					found: i18n.string (109),
					expected: "",
					position: -1
				};
			planNextCommand (done);
			break;
		case 3: /* иначе */
			topOfStack = this.stack.length? this.stack[this.stack.length - 1]: null;
			if (topOfStack && (topOfStack.code == 1 || topOfStack.code == 2)) {
				/* Изменение состояния активности, если вход в команду ветвления */
				/* был выполнен в активном состоянии.                            */
				if (topOfStack.active)
					this.active = !this.active;
			}
			else
				/* Ошибка: "иначе" без соответствующего "если". */
				this.error = {
					message: i18n.string (103),
					found: i18n.string (110),
					expected: i18n.string (111),
					position: 0
				};
			planNextCommand (done);
			break;
		case 4: /* пока впереди край */
			if (this.stack.length < this.stackCapacity) {
				this.stack.push ({code: this.command.code, ip: this.ip, active: this.active});
				this.active = this.active && player.queryEdgeAhead ();
			}
			else
				/* Ошибка: переполнение стека. */
				this.error = {
					message: i18n.string (103),
					found: i18n.string (109),
					expected: "",
					position: -1
				};
			planNextCommand (done);
			break;
		case 5: /* пока впереди не край */
			if (this.stack.length < this.stackCapacity) {
				this.stack.push ({code: this.command.code, ip: this.ip, active: this.active});
				this.active = this.active && !player.queryEdgeAhead ();
			}
			else
				/* Ошибка: переполнение стека. */
				this.error = {
					message: i18n.string (103),
					found: i18n.string (109),
					expected: "",
					position: -1
				};
			planNextCommand (done);
			break;
		case 6: /* конец ветвления */
			topOfStack = this.stack.pop ();
			if (topOfStack && (topOfStack.code == 1 || topOfStack.code == 2))
				/* Восстановление состояния активности, действующего */
				/* на момент входа в команду ветвления.              */
				this.active = topOfStack.active;
			else
				/* Ошибка: "конец ветвления" без соотвествующего "если". */
				this.error = {
					message: i18n.string (103),
					found: i18n.string (112),
					expected: i18n.string (111),
					position: 0
				};
			planNextCommand (done);
			break;
		case 7: /* конец цикла */
			topOfStack = this.stack.pop ();
			if (topOfStack && (topOfStack.code == 4 || topOfStack.code == 5))
				if (this.active)
					this.ip = topOfStack.ip - 1;
				else
					this.active = topOfStack.active;
			else
				/* Ошибка: "конец цикла" без соответствующего "пока". */
				this.error = {
					message: i18n.string (103),
					found: i18n.string (113),
					expected: i18n.string (111),
					position: 0
				};
			planNextCommand (done);
			break;
		case 8: /* конец процедуры */
			topOfStack = this.stack.pop ();
			if (topOfStack && (topOfStack.code == 9 || topOfStack.code == 10))
				if (topOfStack.code == 9)
					/* Восстановление активности после пропуска определения процедуры. */
					this.active = topOfStack.active;
				else
					/*     Возврат после завершения выполнения процедуры   */
					/* ("сделай" помещается в стек только в активном режиме) */
					this.ip = topOfStack.ip;
			else
				/* Ошибка: конец процедуры без соответствующего заголовка или вызова. */
				this.error = {
					message: i18n.string (103),
					found: i18n.string (114),
					expected: i18n.string (111),
					position: 0
				}
			planNextCommand (done);
			break;
		case 9: /* процедура */
			if (this.stack.length == 0) {
				this.stack.push ({code: this.command.code, ip: this.ip, active: this.active});
				/* Отключение выполнения команд, находящихся в определении процедуры. */
				this.active = false;
			}
			else
				/* Ошибка: определение процедуры должно находиться на верхнем уровне. */
				this.error = {
					message: i18n.string (103),
					found: i18n.string (115),
					expected: i18n.string (111),
					position: 0
				};
			planNextCommand (done);
			break;
		case 10: /* сделай */
			if (this.active) {
				if (this.proc[this.command.args[0]] != undefined) {
					if (this.stack.length < this.stackCapacity) {
						this.stack.push ({code: this.command.code, ip: this.ip, active: this.active});
						this.ip = this.proc[this.command.args[0]];
					}
					else
						/* Ошибка: переполнение стека. */
						this.error = {
							message: i18n.string (103),
							found: i18n.string (109),
							expected: "",
							position: -1
						};
				}
				else
					/* Ошибка: процедура не определена. */
					this.error = {
						message: i18n.string (103),
						found: i18n.string (116, this.command.args[0]),
						expected: "",
						position: -1
					};
			}
			planNextCommand (done);
			break;
		default: /* нет команды */
			planNextCommand (done);
		}
	}
	else
		/* Завершение выполнения программы. */
		preDone ();
};
/*====================================*/
/* Перевод программы в режим отладки. */
/*====================================*/
program.turnDebugOn = function ()
{
	this.mode = 2;
}
/*================================================================*/
/* Продолжение выполнения программы после прерывания.             */
/* Вызов: done - функция, выполняемая после завершения программы. */
/*================================================================*/
program.continueExecution = function (done)
{
	this.mode = 0;
	this.executeCommand (done);
}
/*=============================================*/
/* Формирование строки с сообщением об ошибке. */
/*=============================================*/
program.getErrorMessage = function () {
	var s;
	if (this.error) {
		s = this.ip < this.atext.length? i18n.string (117, this.ip + 1, this.atext[this.ip]): i18n.string (118);
		if (this.error.position >= 0)
			 s += "\n" + this.error.message +
			"\n" + i18n.string (119, this.error.position + 1) + this.error.found +
			"\n" + i18n.string (120) + this.error.expected;
		else
			s += "\n" + this.error.message + "\n" + this.error.found;
	}
	else
		s = i18n.string (121);
	return s;
};