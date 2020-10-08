/*=============================*/
/* Объект интернационализации. */
/*=============================*/
var i18n = new Object ();
i18n.language = "ru";		/* код языка по умолчанию */
i18n.strTable = new Object ();	/* таблица текстовых строк */
i18n.plTree = new Object ();	/* таблица деревьев языка программирования */
/*=================================================*/
/* Получение строки на предпочитаемом языке.       */
/* Вызов: strId - идентификатор строки,            */
/*        ... - значения для подстановки в строку. */
/*=================================================*/
i18n.string = function (strId /* , ... */)
{
	var s, p1, p2, c, a = new Array ();
	/* Извлечение локализованной строки из таблицы. */
	s = this.strTable[this.language] && this.strTable[this.language][strId]?
		this.strTable[this.language][strId]:
		"<!-- STRING \"" + this.language + ":" + strId + "\" NOT FOUND -->";
	/* Подстановка значений в полученную строку. */
	p1 = 0;
	p2 = s.indexOf ("%");
	while (p2 >= 0) {
		c = s.charAt (p2 + 1);
		if ("1" <= c && c <= "9") {
			a.push (s.substring (p1, p2));
			a.push (arguments[Number (c)]);
			p1 = p2 + 2;
		}
		p2 = s.indexOf ("%", p2 + 1);
	}
	if (p1 < s.length)
		a.push (s.substring (p1, s.length));
	return a.join ("");
}
/*============================================*/
/* Получение списка доступных языков.         */
/* Возврат: массив с кодами доступных языков. */
/*============================================*/
i18n.languages = function ()
{
	var p, a = new Array ();
	for (p in this.strTable)
		a.push (p);
	return a;
}