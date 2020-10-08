/*======================*/
/* Доска для рисования. */
/*======================*/
var board = new Object ();
/*=======================================================*/
/* Подготовка к работе с объектом "Доска для рисования". */
/* Вызов: elem - элемент Canvas,                         */
/*        width - ширина области рисования в пикселях,   */
/*        height - высота области рисования в пикселях,  */
/*        sx - ширина клетки в пикселях,                 */
/*        sy - высота клетки в пикселях.                 */
/*=======================================================*/
board.init = function (elem, width, height, sx, sy) {
	elem.width = width; 
	elem.height = height;
	this.elem = elem;
	this.sx = sx;
	this.sy = sy;
	this.wash ();
};
/*===================================================*/
/* Метод объекта "Доска": рисование линии.           */
/* Вызов: (c, r) - столбец и строка начального узла, */
/*        (dc, dr) - направление рисования,          */
/*        k - длина отрезка в долях клетки.          */
/*===================================================*/
board.drawLine = function (c, r, dc, dr, k)
{
	var context = this.elem.getContext ("2d"),
	x1 = c * this.sx + 0.5,
	y1 = r * this.sy + 0.5,
	x2 = x1 + Math.floor (this.sx * dc * k),
	y2 = y1 + Math.floor (this.sy * dr * k);
	context.strokeStyle = "cyan";
	context.beginPath ();
	context.moveTo (x1, y1);
	context.lineTo (x2, y2);
	context.stroke ();
};
/*===================================================*/
/* Метод объекта "Доска": очистка и рисование сетки. */
/*===================================================*/
board.wash = function () {
	var context = this.elem.getContext ("2d");
	context.strokeStyle="blue";
	/* Очистка доски. */
	context.clearRect (0, 0, this.elem.width - 1, this.elem.height - 1);
	/* Рисование горизонтальных линий сетки. */
	y1 = y2 = 0.5;
	x1 = 0; x2 = this.elem.width - 1;
	while (y1 < this.elem.height) {
		context.moveTo (x1, y1);
		context.lineTo (x2, y2);
		y2 = y1 += this.sy;
	}
	/* Рисование вертикальных линий сетки. */
	x1 = x2 = 0.5;
	y1 = 0; y2 = this.elem.height - 1;
	while (x1 < this.elem.width) {
		context.moveTo (x1, y1);
		context.lineTo (x2, y2);
		x2 = x1 += this.sx;
	}
	context.stroke ();
};