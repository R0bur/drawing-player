/*==============================================================*/
/* Объект: указатель доски для рисования.                       */
/* Изображение указателя перемещается над доской в соответствии */
/* с поступающими от исполнителя командами.                     */
/*==============================================================*/
var boardptr = new Object ();
/*======================================================================*/
/* Подготовка к работе с указателем.                                    */
/* Вызов: board - объект "доска для рисования",                         */
/*        src - путь к файлу с изображением указателя,                  */
/*        w, h - размеры изображения указателя.                         */
/*======================================================================*/
boardptr.init = function (board, src, w, h) {
	var boardStyle = board.elem.currentStyle || window.getComputedStyle (board.elem, null);
	this.board = board;
	this.x0 = board.elem.offsetLeft + parseInt (boardStyle.borderLeftWidth) + parseInt (boardStyle.paddingLeft);
	this.y0 = board.elem.offsetTop + parseInt (boardStyle.borderTopWidth) + parseInt (boardStyle.paddingTop);
	this.sprite = new Sprite (src, w, h, "absolute");
	this.sprite.moveTo (this.x0, this.y0);
	board.elem.parentNode.appendChild (this.sprite.elem);
};
/*----------------------------------------------------------------*/
/* Адаптация указателя к изменившимся размерам окна веб-браузера. */
/*----------------------------------------------------------------*/
boardptr.windowresize = function () {
	var boardStyle = board.elem.currentStyle || window.getComputedStyle (board.elem, null);
	this.x0 = this.board.elem.offsetLeft + parseInt (boardStyle.borderLeft) + parseInt (boardStyle.paddingLeft);
	this.y0 = this.board.elem.offsetTop + parseInt (boardStyle.borderTop) + parseInt (boardStyle.paddingTop);
};
/*===========================================*/
/* Изменение видимости указателя.            */
/* Вызов: f - признак видимости:             */
/*        true - видимый, false - невидимый. */
/*===========================================*/
boardptr.display = function (f)
{
	this.sprite.show (f);
};
/*=================================================*/
/* Изменение представления указателя над доской.   */
/* Вызов: direction - направление указателя,       */
/*        action - вариант действия:               */
/*        1 - прыжок,                              */
/*        2 - шаг,                                 */
/*        3 - поворот,                             */
/*        4 - ошибка.                              */
/*        phase - фаза действия.                   */
/* Нулевая фаза в любом варианте действия означает */
/* состояние покоя.                                */
/*=================================================*/
boardptr.view = function (direction, action, phase)
{
	var w, h, ix, iy;
	w = this.sprite.getWidth ();
	h = this.sprite.getHeight ();
	ix = direction * w;
	iy = action > 4 || action < 1 || phase < 1? 0: h * 3 * (action - 1) + h * phase;
	this.sprite.moveImageTo (-ix, -iy);
};
/*========================================================*/
/* Позиционирование указателя над доской при перемещении. */
/* Вызов: c, r - координаты текущего узла,                */
/*        dc, dr - смещения направления перемещения,      */
/*        d - номер направления перемещения,              */
/*        phm - фаза перемещения,                         */
/*        nphm - количество фаз перемещения.              */
/*========================================================*/
boardptr.move = function (c, r, dc, dr, d, phm, nphm)
{
	var x, y, w, h, k;
	/* Вычисление экранных координат текущего узла. */
	x = this.x0 + this.board.sx * c + 2;
	y = this.y0 + this.board.sy * r + 1;
	/* Смещение спрайта относительно узла в сторону перемещения. */
	w = this.sprite.getWidth ();
	h = this.sprite.getHeight ();
	x += Math.floor ((dc - 1) * 0.5 * w) - (dc < 0? 2: 0);
	y += Math.floor ((dr - 1) * 0.5 * h) - (dr < 0? 2: 0);
	/* Смещение спрайта в соответствии с фазой перемещения. */
	k = phm / nphm;
	x += Math.floor (dc * this.board.sx * k);
	y += Math.floor (dr * this.board.sy * k);
	/* Позиционирование спрайта в требуемой фазе.*/
	this.sprite.moveTo (x, y);
};
/*==============================================================*/
/* Позиционирование указателя над доской при повороте.          */
/* Вызов: c, r - координаты текущего узла,                      */
/*        dc1, dr1 - смещения текущего направления перемещения, */
/*        dc2, dr2 - смещения нового направления перемещения,   */
/*        d - номер текущего направления перемещения,           */
/*        phd - фаза поворота,                                  */
/*        nphd - количество фаз поворота.                       */
/*==============================================================*/
boardptr.turn = function (c, r, dc1, dr1, dc2, dr2, d, phd, nphd)
{
	w = this.sprite.getWidth ();
	h = this.sprite.getHeight ();
	/* Вычисление экранных координат текущего узла. */
	x = this.x0 + this.board.sx * c + 2;
	y = this.y0 + this.board.sy * r + 1;
	/* Вычисление позиции спрайта с учётом текущего направления перемещения. */
	x1 = x + Math.floor ((dc1 - 1) * 0.5 * w);
	y1 = y + Math.floor ((dr1 - 1) * 0.5 * h);
	/* Вычисление позиции спрайта с учётом нового направления перемещения. */
	x2 = x + Math.floor ((dc2 - 1) * 0.5 * w);
	y2 = y + Math.floor ((dr2 - 1) * 0.5 * h);
	/* Вычисление позиции спрайта с учётом фазы поворота. */
	k = phd / (nphd - phd);
	xd = (k * x2 + x1) / (1 + k);
	yd = (k * y2 + y1) / (1 + k);
	/* Позиционирование спрайта. */
	this.sprite.moveTo (xd, yd);
}