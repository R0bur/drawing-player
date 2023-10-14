<?php
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
/* <input type="hidden" name="sound" value="ext">  */
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
$varsound = array ('off' => '0', 'no' => '0', 'ext' => '2', 'adv' => '2');
$html = file_get_contents ('index.html');
if (array_key_exists ('program', $_POST)):
	$subst['PROGRAM_HERE'] = strtr ($_POST['program'], '<>"\'`:/\\', '        ');
	$subst['/* app.mode */'] = 'app.mode = 2;';
endif;
if (array_key_exists ('lang', $_POST) and mb_strlen ($_POST['lang']) < 6):
	$subst['/* app.lang */'] = 'app.lang = "' . strtr ($_POST['lang'], '<>"\'`:/\\', '        ') . '";';
endif;
if (array_key_exists ('sound', $_POST) and mb_strlen ($_POST['sound']) < 6 and array_key_exists ($_POST['sound'], $varsound)):
	$subst['/* app.sound */'] = 'app.sound = ' . $varsound[$_POST['sound']] . ';';
endif;
echo strtr ($html, $subst);
?>