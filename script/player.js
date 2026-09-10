/*=======================*/
/* Объект "Исполнитель". */
/*=======================*/
var player = new Object ();
/*==================================*/
/* Подготовка исполнителя к работе. */
/* Вызов: nc - количество столбцов, */
/*        nr - количество строк.    */
/*==================================*/
player.init = function (nc, nr)
{
	this.directions = [{dc: 1, dr: 0}, {dc: 0, dr: -1}, {dc: -1, dr: 0}, {dc: 0, dr: 1}];
	this.c0 = 0;		/* начальный столбец */
	this.r0 = 0;		/* начальная строка */
	this.d0 = 0;		/* начальное направление */
	this.nc = nc;		/* количество столбцов */
	this.nr = nr;		/* количество строк */
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
	this.c = this.c0;	/* столбец */
	this.r = this.r0;	/* строка */
	this.d = this.d0;	/* направление */
	this.e = false;	/* признак ошибки */
	board.wash ();
	if (task.isset ())
		board.drawTask (task.m, task.c1, task.r1, this.directions[task.d1].dc, this.directions[task.d1].dr);
	boardmap.wash ();
	boardptr.view (this.d, 0, 0);
	boardptr.move (this.c, this.r, this.directions[this.d].dc, this.directions[this.d].dr, this.d, 0, 1);
};
/*=================================================================*/
/* Использование текущей позиции исполнителя в качестве начальной. */
/*=================================================================*/
player.home = function ()
{
	this.c0 = this.c;
	this.r0 = this.r;
	this.d0 = this.d;
	app.soundPlay ("AppInit");
};
/*=========================================*/
/* Указание начальной позиции исполнителю. */
/* Вызов: c - начальный столбец,           */
/*        r - начальная строка,            */
/*        d - начальное направление.       */
/*=========================================*/
player.setHome = function (c, r, d)
{
	this.c0 = c;
	this.r0 = r;
	this.d0 = d;
}
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
			if (drawing)
				boardmap.drawLine (this.c, this.r, this.directions[this.d].dc, this.directions[this.d].dr);
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
		if (drawing) {
			board.drawLine (this.c, this.r, this.directions[this.d].dc, this.directions[this.d].dr, 1.0);
			boardmap.drawLine (this.c, this.r, this.directions[this.d].dc, this.directions[this.d].dr);
		}
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