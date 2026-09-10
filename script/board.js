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
	this.w = 3;
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
	var context = this.elem.getContext ("2d"), dw = 0.5 * this.w,
	x1 = (1 + c) * this.sx - dw,
	y1 = (1 + r) * this.sy - dw,
	x2 = x1 + Math.floor (this.sx * dc * k),
	y2 = y1 + Math.floor (this.sy * dr * k);
	context.strokeStyle = "lightgreen";
	context.lineWidth = this.w;
	context.beginPath ();
	context.moveTo (x1, y1);
	context.lineTo (x2, y2);
	context.stroke ();
};
/*===================================================*/
/* Метод объекта "Доска": очистка и рисование сетки. */
/*===================================================*/
board.wash = function () {
	var context = this.elem.getContext ("2d"), x1, y1, x2, y2, dw;
	context.strokeStyle = "green";
	context.lineWidth = this.w;
	context.beginPath ();
	/* Очистка доски. */
	context.clearRect (0, 0, this.elem.width - 1, this.elem.height - 1);
	/* Рисование горизонтальных линий сетки. */
	dw = 0.5 * this.w;
	y1 = y2 = this.sy - dw;
	x1 = this.sx - dw; x2 = this.elem.width - this.sx - dw;
	while (y1 < this.elem.height - this.sy) {
		context.moveTo (x1, y1);
		context.lineTo (x2, y2);
		y2 = y1 += this.sy;
	}
	/* Рисование вертикальных линий сетки. */
	x1 = x2 = this.sx - dw;
	y1 = this.sy - dw; y2 = this.elem.height - this.sy - dw;
	while (x1 < this.elem.width - this.sx) {
		context.moveTo (x1, y1);
		context.lineTo (x2, y2);
		x2 = x1 += this.sx;
	}
	context.stroke ();
};
/*==================================================*/
/* Метод объекта "Доска": рисование условия задачи. */
/* Вызов: map - план рисунка,                       */
/*        c, r, d - столбец, строка и направление   */
/*                  исполнителя после рисования.    */
/*==================================================*/
board.drawTask = function (map, c, r, dc, dr) {
	var context = this.elem.getContext ("2d"), i = 0, x1, x2, y1, y2, dw = 0.5 * this.w;
	context.strokeStyle="gray";
	context.lineWidth = this.w;
	context.beginPath ();
	y2 = this.sy - dw;
	/* Отображение плана рисунка. */
	while (y2 < this.elem.height - this.sy) {
		/* Рисование ряда горизонтальных отрезков. */
		x1 = this.sx - dw;
		y1 = y2;
		while (x1 < this.elem.width - 2 * this.sx) {
			x2 = x1 + this.sx;
			if (map[i++]) {
				context.moveTo (x1, y1);
				context.lineTo (x2, y2);
			}
			x1 = x2;
		}
		/* Рисование ряда вертикальных отрезков. */
		x1 = this.sx - dw;
		y2 = y1 + this.sy;
		if (y2 < this.elem.height - this.sy) {
			while (x1 < this.elem.width - this.sx)
			{
				x2 = x1;
				if (map[i++]) {
					context.moveTo (x1, y1);
					context.lineTo (x2, y2);
				}
				x1 += this.sx;
			}
		}
	}
	context.stroke ();
	/* Отображение конечного состояния исполнителя. */
	x1 = (1 + c + 0.4 * dc) * this.sx - dw;
	y1 = (1 + r + 0.4 * dr) * this.sy - dw;
	context.fillStyle = "gray";
	context.beginPath ();
	context.arc (x1, y1, 0.4 * 0.5 * (this.sx + this.sy), 0, 2 * Math.PI);
	context.stroke ();
	context.beginPath ();
	context.arc (x1 + 0.5 * dc * this.sx, y1 + 0.5 * dr * this.sy, 0.2 * 0.5 * (this.sx + this.sy), 0, 2 * Math.PI);
	context.stroke ();
}