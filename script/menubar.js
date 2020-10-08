/*======================*/
/* Горизонтальное меню. */
/*======================*/
/*==============================================================*/
/* Создание горизонтального меню.                               */
/* Вызов: elem - элемент-контейнер HTMLElement для строки меню, */
/*        items - массив объектов, представляющих пункты меню:  */
/*        .hotkey - клавиша вызова пункта меню,                 */
/*        .text - текст пункта меню,                            */
/*        .handler - функция-обработчик пункта меню.            */
/*==============================================================*/
function createMenubar (elem, items)
{
	var body = document.getElementsByTagName ("body")[0], i, sk, ai;
	/* Очистка строки меню. */
	while (elem.hasChildNodes ())
		elem.removeChild (elem.lastChild);
	/* Составление строки меню. */
	for (i in items) {
		sk = document.createElement ("span");
		sk.style.fontWeight = "bold";
		sk.appendChild (document.createTextNode (items[i].hotkey));
		ai = document.createElement ("a");
		ai.href="#";
		ai.appendChild (sk);
		ai.appendChild (document.createTextNode (items[i].text));
		ai.onclick = function (handler) {
			return function () { if (app.userinput) handler (); return false; };
		} (items[i].handler);
		elem.appendChild (ai);
	}
	/* Установка обработчика событий от клавиатуры. */
	body.onkeydown = function () {
		var result = true, i, key = event.key.substring (0, 3).toUpperCase ();
		for (i in items)
			if (key == items[i].hotkey) {
				if (app.userinput)
					items[i].handler ();
				result = false;
				break;
			}
		/* if (result)
			debugObject (event, "Объект event"); */
		return result;
	}
}