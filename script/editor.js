/*=====================================*/
/* ������ - �������� ������ ���������. */
/*=====================================*/
var editor = new Object ();
/*===============================================================*/
/* ����� ������� "��������" - �������� � �������� HTML TEXTAREA. */
/* �����: elem - HTML-������� TEXTAREA.                          */
/*===============================================================*/
editor.init = function (elem) {
	elem.spellcheck = false;
	elem.translate = false;
	if (elem.value == "PROGRAM_HERE")
		elem.value = "";
	this.elem = elem;
};
/*====================================================================*/
/* ����� ������� "��������" - ��������� ������ ����������� ���������. */
/* �����: true - �������� �������� ��� ������ � ������� ���������,    */
/*        false - �������� �� ��������.                               */
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
/* ����� ������� "��������" - �������� ����� �������������� ������. */
/*==================================================================*/
editor.clean = function ()
{
	this.elem.value = "";
	this.elem.focus ();
};
/*=======================================================================*/
/* ����� ������� "��������" - ������� ������ � ������� �������.          */
/* �����: text - ����������� �����.                                      */
/* URL ���������: 'https://stackoverflow.com/questions/11076975/' +      */
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
/*===========================================================================*/
/* ����� ������� "��������" - ��������� ����� ������� ����������� ������.    */
/* �����: c - ��� ����� (0 ��� 1 - �����������, 2 ��� 3 - ������� ���������, */
/*                       4 ��� 5 - ������� �� ���������, -1 - �������).      */
/*===========================================================================*/
editor.setSelectionColor = function (c) {
	var styles = ["neutral1", "neutral2", "condtrue1", "condtrue2", "condfalse1", "condfalse2"], i;
	if (c >= 0) {
		for (i in styles)
			if (i != c)
				this.elem.classList.remove (styles[i]);
		this.elem.classList.add (styles[c]);
	}
	else
		for (i in styles)
			this.elem.classList.remove (styles[i]);
};
/*=========================================================================*/
/* ����� ������� "��������" - ���������� ���������� � ��������� ���������. */
/* �����: c - ��� ����� ��������� (0 - �����������, 1 - "��", 2 - "���",   */
/*        duration - ����������������� ���������� (� �������������),       */
/*        done - �������, ���������� ����� ����������.                     */
/*=========================================================================*/
editor.flashSelection = function (c, duration, done) {
	var o = this, i = 0;
	function changeSelectionColor () {
		if (i < 3) {
			o.setSelectionColor (2 * c + i % 2);
			i++;
			setTimeout (changeSelectionColor, duration);
		}
		else {
			o.setSelectionColor (-1);
			done ();
		}
	}
	changeSelectionColor ();
};
/*==================================================================*/
/* ����� ������� "��������" - ��������� ������.                     */
/* �����: k - ����� ������,                                         */
/*        n - ����� ���������� �����.                               */
/* URL ���������: 'https://stackoverflow.com/questions/13650534/' + */
/*                'how-to-select-line-of-text-in-textarea'          */
/*==================================================================*/
editor.selectLine = function (k, n)
{
	var startPos, endPos, v = this.elem.value, range, d;
	/* ����������� ������� ������ � ����� ������ �� � ������. */
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
		/* ��������� ������. */
		if (document.selection) {
			/* IE */
			this.elem.focus ();
			this.elem.select ();
			range = document.selection.createRange ();
			range.collapse (true);
			range.moveEnd ("character", endPos);
			range.moveStart ("character", startPos);
			range.select ();
		}
		else if (this.elem.selectionStart || this.elem.selectionStart === 0) {
			/* Others */
			this.elem.focus ();
			this.elem.selectionStart = startPos;
			this.elem.selectionEnd = endPos;
		}
		/* ��������� ������ ��� ���������� ���������� ������ � �������� ������� ���������. */
		if (this.elem.scrollHeight && this.elem.offsetHeight)
			this.elem.scrollTop = Math.floor (this.elem.scrollHeight / n * k - 0.5 * this.elem.offsetHeight);
	}
}
/*==================================================================*/
/* ����� ������� "��������" - ���������� ������ � ������ ���������. */
/* �����: s - ����������� ������.                                   */
/*==================================================================*/
editor.append = function (s) {
	this.elem.value += s;
};
