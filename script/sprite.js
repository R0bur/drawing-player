/*====================================================*/
/* Конструктор объекта "Спрайт".                      */
/* Вызов: src - путь к файлу с изображением,          */
/*        width - ширина спрайта в пикселях,          */
/*        height - высота спрайта в пикселях,         */
/*        position - способ позиционирования спрайта. */
/*====================================================*/
function Sprite (src, width, height, position)
{
	if (src == undefined) return;	/* Фиктивное созданеие объекта. */
	var img = document.createElement ("img"), div = document.createElement ("div");
	img.style.position = "relative";
	img.style.verticalAlign = "top";
	img.src = src;
	div.style.overflow = "hidden";
	div.style.position = position || "absolute";
	if (width)
		div.style.width = width + "px";
	if (height)
		div.style.height = height + "px";
	/* Добавление изображения в рамку спрайта. */
	div.appendChild (img);
	this.elem = div;
}
new Sprite (); /* Создание фиктивного объекта для гарантированной активации свойства prototype. */
/*===========================================*/
/* Метод объекта "Спрайт": получение ширины. */
/*===========================================*/
Sprite.prototype.getWidth = function ()
{
	return parseInt (this.elem.style.width);
}
/*===========================================*/
/* Метод объекта "Спрайт": получение высоты. */
/*===========================================*/
Sprite.prototype.getHeight = function ()
{
	return parseInt (this.elem.style.height);
}
/*=================================================================*/
/* Метод объекта "Спрайт": размещение спрайта в указанной позиции. */
/* Вызов: left, top - новая позиция левого верхнего угла спрайта.  */
/*=================================================================*/
Sprite.prototype.moveTo = function (left, top)
{
	var lpx = left + "px", tpx = top + "px";
	this.elem.style.left = left + "px";
	this.elem.style.top = top + "px";

};
/*=================================================================*/
/* Метод объекта "Спрайт": смещение спрайта на указанную величину. */
/* Вызов: dx, dy - величины смещения.                              */
/*=================================================================*/
Sprite.prototype.moveBy = function (dx, dy)
{
	var left = parseInt (this.elem.style.left),
	top = parseInt (this.elem.style.top);
	this.elem.style.left = (isNaN (left)? dx: left + dx) + "px";
	this.elem.style.top = (isNaN (top)? dy: top + dy) + "px";
};
/*===============================================================================*/
/* Метод объекта "Спрайт": смещение вложенного изображения в указанную позицию.  */
/* Вызов: left, top - новая позиция левого верхнего угла вложенного изображения. */
/*===============================================================================*/
Sprite.prototype.moveImageTo = function (left, top)
{
	this.elem.firstChild.style.left = left + "px";
	this.elem.firstChild.style.top = top + "px";
	
};
/*================================================================================*/
/* Метод объекта "Спрайт": смещение вложенного изображения на указанную величину. */
/* Вызов: dx, dy - величины смещения.                                             */
/*================================================================================*/
Sprite.prototype.moveImageBy = function (dx, dy)
{
	var left = parseInt (this.elem.firstChild.style.left),
	top = parseInt (this.elem.firstChild.style.top);
	left = (isNaN (left)? 0: left) + dx + "px";
	top = (isNaN (top)? 0: top) + dy + "px";
	this.elem.firstChild.style.left = left;
	this.elem.firstChild.style.top = top;
};
/*==================================================*/
/* Метод объекта "Спрайт": отображение и сокрытие.  */
/* Вызов: mode - устанавливаемый режим отображения. */
/*==================================================*/
Sprite.prototype.show = function (mode) {
	this.elem.style.visibility = mode? "visible": "hidden";
};
