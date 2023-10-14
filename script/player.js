/*=======================*/
/* Объект "Исполнитель". */
/*=======================*/
var player = new Object ();
/*==================================*/
/* Подготовка исполнителя к работе. */
/*==================================*/
player.init = function ()
{
	this.directions = [{dc: 1, dr: 0}, {dc: 0, dr: -1}, {dc: -1, dr: 0}, {dc: 0, dr: 1}];
	this.nc = 16;		/* количество столбцов */
	this.nr = 20;		/* количество строк */
	this.timeout = 250;	/* время фазы исполнения в миллисекундах */
};
/*===========================================*/
/* Отображение и сокрытие исполнителя.       */
/* Вызов: f - признак отображения:           */
/*        true - отобразить, false - скрыть. */
/*===========================================*/
player.display = function (f)
{
	/* Перед отображением указатель размещается в нужной позиции и фазе действия.*/
	if (f) {
		boardptr.move (this.c, this.r, this.directions[this.d].dc, this.directions[this.d].dr, this.d, 0, 1);
		boardptr.view (this.d, this.e? 4: 0, this.e? 1: 0);
	}
	boardptr.display (f);
};
/*===========================================*/
/* Возврат исполнителя в исходное положение. */
/*===========================================*/
player.reset = function ()
{
	this.c = 0;	/* столбец */
	this.r = 0;	/* строка */
	this.d = 0;	/* направление */
	this.e = false;	/* признак ошибки */
	board.wash ();
	boardptr.view (this.d, 0, 0);
	boardptr.move (this.c, this.r, this.directions[this.d].dc, this.directions[this.d].dr, this.d, 0, 1);
};
/*=====================================================*/
/* Перемещение исполнителя в текущем направлении.      */
/* Вызов: drawing - признак рисования при перемещении, */
/*        done - функция, вызываемая по завершении,    */
/*        phase - фаза перемещения.                    */
/*=====================================================*/
player.walk = function (drawing, done, phase)
{
	var newC, newR, o, nph = 4, k;
	newC = this.c + this.directions[this.d].dc;
	newR = this.r + this.directions[this.d].dr;
	/* Выполнение фазы перемещения исполнителя. */
	if (!phase) {
		/* Начальная фаза перемещения. */
		this.e = this.e || !(0 <= newC && newC < this.nc && 0 <= newR && newR < this.nr);
		phase = this.e? nph: 1;
		/* Изменение вида указателя в случае возникновения ошибки. */
		if (this.e)
			boardptr.view (this.d, 4, 1);
		else
			app.soundPlay (drawing? "Step": "Hop");
	}
	if (phase < nph){
		/* Промежуточная фаза перемещения. */
		k = phase / (nph - 1);
		if (drawing)
			board.drawLine (this.c, this.r, this.directions[this.d].dc, this.directions[this.d].dr, k);
		boardptr.view (this.d, drawing? 2: 1, phase);
		boardptr.move (this.c, this.r, this.directions[this.d].dc, this.directions[this.d].dr, this.d, phase, nph);
		/* Планирование следующей фазы. */
		o = this;
		setTimeout (function () { o.walk (drawing, done, phase + 1); }, this.timeout);
	}
	else {
		/* Завершающая фаза перемещения. */
		if (!this.e) {
			this.c = newC;
			this.r = newR;
			boardptr.view (this.d, drawing? 2: 1, 0);
			boardptr.move (this.c, this.r, this.directions[this.d].dc, this.directions[this.d].dr, this.d, 0, nph);
		}
		done ();
	}
};
/*==================================================*/
/* Поворот исполнителя на четверть окружности.      */
/* Вызов: done - функция, вызываемая по завершении, */
/*        phase - фаза поворота.                    */
/*==================================================*/
player.turn = function (done, phase)
{
	var o, d1, d2, nph = 4;
	/* Выполнение фазы поворота исполнителя. */
	if (!phase) {
		/* Начальная фаза поворота. */
		phase = this.e? nph: 1;
		app.soundPlay ("Turn");
	}
	if (phase < nph) {
		/* Промежуточная фаза поворота. */
		d1 = this.directions[this.d];
		d2 = this.directions[(this.d + 1) % this.directions.length];
		boardptr.view (this.d, 3, phase);
		boardptr.turn (this.c, this.r, d1.dc, d1.dr, d2.dc, d2.dr, this.d, phase, nph);
		/* Планирование следующей фазы. */
		o = this;
		setTimeout (function () {o.turn( done, phase + 1); }, this.timeout);
	}
	else {
		/* Завершающая фаза поворота. */
		if (!this.e) {
			this.d = (this.d + 1) % this.directions.length;
			boardptr.view (this.d, 0, 0);
			boardptr.move (this.c, this.r, this.directions[this.d].dc, this.directions[this.d].dr, this.d, 0, 1);
		}
		done ();
	}
};
/*========================================================*/
/* Быстрое перемещение исполнителя в текущем направлении. */
/* Вызов: drawing - признак рисования при перемещении,    */
/*        done - функция, вызываемая по завершении.       */
/*========================================================*/
player.quickWalk = function (drawing, done) {
	var newC, newR;
	/* Вычисление новых координат. */
	newC = this.c + this.directions[this.d].dc;
	newR = this.r + this.directions[this.d].dr;
	/* Проверка возможности перемещения. */
	this.e = this.e || !(0 <= newC && newC < this.nc && 0 <= newR && newR < this.nr);
	if (!this.e) {
		/* Рисование линии при необходимости. */
		if (drawing)
			board.drawLine (this.c, this.r, this.directions[this.d].dc, this.directions[this.d].dr, 1.0);
		/* Обновление координат. */
		this.c = newC;
		this.r = newR;
	}
	/* Выполнение завершающей функции. */
	done ();
};
/*==============================*/
/* Быстрый поворот исполнителя. */
/*==============================*/
player.quickTurn = function (done) {
	if (!this.e)
		this.d = (this.d + 1) % this.directions.length;
	done ();
};
/*============================================*/
/* Метод объекта "исполнитель": впереди край? */
/* Возврат: true - впереди край,              */
/*          false - впереди не край.          */
/*============================================*/
player.queryEdgeAhead = function ()
{
	var r1 = this.r + this.directions[this.d].dr,
	c1 = this.c + this.directions[this.d].dc;
	return r1 < 0 || r1 >= this.nr || c1 < 0 || c1 >= this.nc;
};
/*===================================================*/
/* Информация о состоянии исполнителя в виде строки. */
/*===================================================*/
player.toString = function ()
{
	return "(" + this.c + "," + this.r + ") -> " + this.d + " [" + (this.e? "Ошибка": "Ок") + "]";
}