﻿/*================================*/
/* Дерево языка программирования. */
/*================================*/
i18n.plTree.ru = {
	"прыжок": -1,
	"шаг": -2,
	"поворот": -3,
	"если": {
		"впереди": {
			"край,": {"то": 1},
			"не": {"край,": {"то": 2}}
		},
	},
	"иначе": 3,
	"пока": {
		"впереди": {
			"край,": {"повторять": 4},
			"не": {"край,": {"повторять": 5}}
		},
	},
	"конец": {
		"ветвления": 6,
		"цикла": 7,
		"процедуры": 8
	},
	"процедура": {"!имя": 9},
	"сделай": {"!имя": 10}
};
/*================*/
/* Таблица строк. */
/*================*/
i18n.strTable.ru = {
	/*------------*/
	/* index.html */
	/*------------*/
	1000: "ГРИС «Букашка»",
	1001: "Игорь Сергеевич Орещенков",
	1002: "Приложение: ",
	1003: "версия: ",
	1004: "Разработал: ",
	/*----------*/
	/* index.js */
	/*----------*/
	/* Пункт меню и сообщения о выходе исполнителя за границы области рисования. */
	1: "сброс",
	2: "АВАРИЯ - исполнитель вышел за границу доски.",
	3: "Нажмите [ESC] для возврата в исходное положение.",
	/* Заголовок и информационное сообщение режима №1 (непосредственное выполнение команд). */
	4: "Режим №1: Непосредственное выполнение команд.",
	5: "Нажмите [ESC], чтобы очистить доску для рисования.",
	6: "Нажмите [TAB] для перехода в режим программирования.",
	/* Заголовок и информационное сообщение режима №2 (программирование). */
	7: "Режим №2: Программирование исполнителя.",
	8: "Нажмите [ESC], чтобы стереть текст программы.",
	9: "Нажмите [TAB] для перехода в режим выполнения программы.",
	/* Заголовок и информационное сообщение режима №3 (выполнение программы). */
	10: "Режим №3: Выполнение программы.",
	11: "Нажмите [TAB] для перехода в режим непосредственного выполнения команд.",
	/* Сообщения об успешном завершении программы. */
	12: "+Выполнение программы успешно завершено.",
	13: "Сделано прыжков: %1, шагов: %2, поворотов: %3.",
	14: "Всего действий: %1.",
	/* Сообщения о прекращении выполнения программы пользователем. */
	15: "Программа остановлена.",
	16: "Выполнение программы прервано пользователем.",
	/* Сообщение о прерывании отладки программы пользователем. */
	17: "-Отладка программы прервана пользователем.",
	/* Пункты меню подрежима выполнения программы. */
	18: "стоп",
	19: "отладка",
	/* Сообщение о продолжении выполнения программы после отладки. */
	20: "Программа выполняется…",
	/* Пункты меню подрежима отладки программы. */
	21: "сброс",
	22: "дальше",
	23: "выполнить",
	/* Сообщение о переходе в режим отладки программы. */
	24: "Идёт отладка программы…",
	/* Текст, который вводится в редактор при выборе команд "прыжок", "шаг", "поворот". */
	25: "прыжок",
	26: "шаг",
	27: "поворот",
	/* Текст, который вводится в редактор при уточнении команды "если". */
	28: "впереди край, то",
	29: "впереди не край, то",
	/* Пункты меню подрежима уточнения пункта меню "если". */
	30: "…впереди край",
	31: "…впереди не край",
	/* Текст ,который вводится в редактор при выборе команд "если" и "иначе". */
	32: "если ",
	33: "иначе",
	/* Текст, который вводится в редактор при уточнении команды "пока". */
	34: "впереди край, повторять",
	35: "впереди не край, повторять",
	/* Пункты меню подрежима уточнения пункта меню "пока". */
	36: "…впереди край",
	37: "…впереди не край",
	/* Текст, который вводится в редактор при выборе пункта меню "пока ". */
	38: "пока ",
	/* Текст, который вводится в редактор при выборе команд "сделай" и "процедура". */
	39: "сделай ",
	40: "процедура ",
	/* Текст, который вводится в редактор при уточнении команды "конец". */
	41: "ветвления",
	42: "цикла",
	43: "процедуры",
	/* Пункты меню подрежима уточнения пункта меню "конец". */
	44: "…ветвления",
	45: "…цикла",
	46: "…процедуры",
	/* Текст, который вводится в редактор при выборе пункта меню "конец". */
	47: "конец ",
	/* Пункты меню подрежима программирования для ввода дополнительных команд. */
	48: "если…",
	49: "иначе",
	50: "пока…",
	51: "сделай",
	52: "проц",
	53: "конец…",
	54: "назад",
	/* Запрос подтверждения на очистку содержимого редактора текста программы. */
	55: "Стереть всю программу?",
	/* Пункты меню режима №1 (непосредственное выполнение команд). */
	56: "прыжок",
	57: "шаг",
	58: "поворот",
	59: "сброс",
	60: "программирование",
	/* Пункты меню режима №2 (программирование). */
	61: "прыжок",
	62: "шаг",
	63: "поворот",
	64: "стереть",
	65: "выполнение",
	/* Пункты меню режима №3 (выполнение программы). */
	66: "пуск",
	67: "отладка",
	68: "результат",
	69: "сброс",
	70: "командование",
	/* Строка состояния. */
	71: "Звук [Alt+s]:",
	72: "норм.",
	73: "расш.",
	74: "нет",
	/* Время выполнения программы. */
	75: "Время выполнения: %1 сек.",
	/*------------*/
	/* program.js */
	/*------------*/
	101: "Синтаксическая ошибка.",
	102: "конец строки",
	103: "Ошибка выполнения программы.",
	104: "Отсутствует команда \"%1\".",
	105: "конец ветвления",
	106: "конец цикла",
	107: "конец процедуры",
	108: "Отказ исполнителя.",
	109: "Превышен допустимый уровень вложенности конструкций.",
	110: "\"иначе\" без предшествующего \"если\"",
	111: "Другая команда.",
	112: "\"конец ветвления\" без предшествующего \"если\"",
	113: "\"конец цикла\" без предшествующего \"пока\"",
	114: "\"конец процедуры\" без предшествующего \"процедура\" или \"сделай\"",
	115: "Определение процедуры не может быть вложено.",
	116: "Процедура \"%1\" не определена.",
	117: "Строка №%1 программы: %2",
	118: "Достигнут конец текста программы.",
	119: "В позиции №%1 обнаружено: ",
	120: "Ожидалось: ",
	121: "Ошибок не обнаружено"
};
