/*=====================================*/
/* Объект - редактор текста программы. */
/*=====================================*/
var editor = new Object ();
/*===============================================================*/
/* Метод объекта "редактор" - привязка к элементу HTML TEXTAREA. */
/* Вызов: elem - HTML-элемент TEXTAREA.                          */
/*===============================================================*/
editor.init = function (elem) {
	elem.spellcheck = false;
	elem.translate = false;
	if (elem.value == "PROGRAM_HERE")
		elem.value = "";
	this.elem = elem;
};
/*====================================================================*/
/* Метод объекта "редактор" - изменение режима доступности редактора. */
/* Вызов: true - редактор доступен для работы с текстом программы,    */
/*        false - редактор не доступен.                               */
/*====================================================================*/
editor.enable = function (access)
{
	if (access) {
		this.elem.removeAttribute ("readonly");
		this.elem.className = "active";
		this.elem.focus ();
	}
	else {
		this.elem.blur ();
		this.elem.setAttribute ("readonly", "readonly");
		this.elem.className = "";
	}
};
/*==================================================================*/
/* Метод объекта "редактор" - удаление всего редактируемого текста. */
/*==================================================================*/
editor.clean = function ()
{
	this.elem.value = "";
	this.elem.focus ();
};
/*=======================================================================*/
/* Метод объекта "редактор" - вставка текста в текущую позицию.          */
/* Вызов: text - вставляемый текст.                                      */
/* URL источника: 'https://stackoverflow.com/questions/11076975/' +      */
/* 'how-to-insert-text-into-the-textarea-at-the-current-cursor-position' */
/*=======================================================================*/
editor.insert = function (text)
{
	var sel, startPos, endPos;
	if (document.selection) {
		/* IE */
		this.elem.focus ();
		sel = document.selection.createRange ();
		sel.text = text;
	}
	else if (this.elem.selectionStart || this.elem.selectionStart == 0) {
		/* Others */
		this.elem.focus ();
		startPos = this.elem.selectionStart;
		endPos = this.elem.selectionEnd;
		this.elem.value = this.elem.value.substring (0, startPos) + text + this.elem.value.substring (endPos, this.elem.value.length);
		this.elem.selectionEnd = this.elem.selectionStart = startPos + text.length;
	}
	else
		this.elem.value += text;
};
/*==================================================================*/
/* Метод объекта "редактор" - выделение строки.                     */
/* Вызов: k - номер строки,                                         */
/*        n - общее количество строк.                               */
/* URL источника: 'https://stackoverflow.com/questions/13650534/' + */
/*                'how-to-select-line-of-text-in-textarea'          */
/*==================================================================*/
editor.selectLine = function (k, n)
{
	var startPos, endPos, v = this.elem.value, range, d;
	/* Определение позиций начала и конца строки по её номеру. */
	i = 0;
	startPos = 0;
	endPos = v.indexOf ("\n", startPos);
	while (i < k && endPos < v.length) {
		startPos = endPos + 1;
		endPos = v.indexOf ("\n", startPos);
		if (endPos == -1)
			endPos = v.length;
		i++;
	}
	if (i == k) {
		/* Выделение строки. */
		if (document.selection) {
			/* IE */
/*			d = this.elem.readonly;
			if (d)
				delete this.elem.readonly;*/
			elem.focus ();
			elem.select ();
			range = document.selection.createRange ();
			range.collapse (true);
			range.moveEnd ("character", endPos);
			range.moveStart ("character", startPos);
			range.select ();
/*			if (d)
				this.elem.readonly = d;*/
		}
		else if (this.elem.selectionStart || this.elem.selectionStart === 0) {
			/* Others */
/*			d = this.elem.getAttribute ("readonly");
			if (d)
				this.elem.removeAttribute ("readonly");*/
			this.elem.focus ();
			this.elem.selectionStart = startPos;
			this.elem.selectionEnd = endPos;
/*			if (d)
				this.elem.setAttribute ("readonly", d);*/
		}
		/* Прокрутка текста для размещения выделенной строки в середине области просмотра. */
		if (this.elem.scrollHeight && this.elem.offsetHeight)
			this.elem.scrollTop = Math.floor (this.elem.scrollHeight / n * k - 0.5 * this.elem.offsetHeight);
	}
}
/*==================================================================*/
/* Метод объекта "редактор" - добавление строки к тексту программы. */
/* Вызов: s - добавляемая строка.                                   */
/*==================================================================*/
editor.append = function (s) {
	this.elem.value += s;
};
