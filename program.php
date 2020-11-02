﻿<?php
/*=================================================*/
/* Модуль передачи текста программы в среду ГРИС.  */
/* Разработчик: Игорь Сергеевич Орещенков, 2020 г. */
/* Язык программирования: PHP.                     */
/* ----------------------------------------------- */
/* Этот модуль надо разместить в одном каталоге с  */
/* файлом главной страницы ГРИС "index.html". Веб- */
/* сервер должен быть настроен на выполнение сце-  */
/* нариев PHP.                                     */
/*                                                 */
/* Текст программы может быть передан модулю по    */
/* протоколу HTTP/POST с использованием следующей  */
/* HTML-формы (кодировка должна быть UTF-8):       */
/*                                                 */
/* <form action=".../program.php" method="post">   */
/* <input type="hidden" name="lang" value="ru">    */
/* <textarea name="program" readonly="readonly">   */
/* ЗДЕСЬ НАХОДИТСЯ ТЕКСТ ПРОГРАММЫ                 */
/* </textarea>                                     */
/* <br><input type="submit" value="Выполнить">     */
/* </form>                                         */
/*                                                 */
/* Здесь в параметре "lang" передаётся код языка   */
/* интерфейса, а в параметре "program" - текст     */
/* программы для исполнителя в соответствии с      */
/* указанным языком интерфейса.                    */
/*=================================================*/
$subst = array ();
$html = file_get_contents ('index.html');
if (array_key_exists ('program', $_POST)):
	$subst['PROGRAM_HERE'] = strtr ($_POST['program'], '<>"\'`:/\\', '        ');
	$subst['/* app.mode */'] = 'app.mode = 2;';
endif;
if (array_key_exists ('lang', $_POST) and mb_strlen ($_POST['lang']) < 6):
	$subst['/* app.lang */'] = 'app.lang = "' . strtr ($_POST['lang'], '<>"\'`:/\\', '        ') . '";';
endif;
echo strtr ($html, $subst);
?>