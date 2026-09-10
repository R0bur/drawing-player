<?php
/*==========================================================*/
/* Сервер среды обучения программированию ГРИС «Букашка».   */
/* Разработчик: Игорь Сергеевич Орещенков, 2026 г.          */
/* Язык программирования: PHP.                              */
/*----------------------------------------------------------*/
/* Файл index.php  с этим сценарием надо разместить в одном */
/* каталоге с файлом index.html среды ГРИС «Букашка».  Веб- */
/* сервер должен быть настроен на выполнение сценариев PHP. */
/* Тогда открыватеся возможность передавать из HTML-страниц */
/* в среду ГРИС задания для решения  и  примеры программ по */
/* протоколу HTTP.                                          */
/*                                                          */
/* Пример HTML-формы для передачи текста программы:         */
/*                                                          */
/* <form action=".../index.php" method="post">              */
/* <input type="hidden" name="lang" value="ru">             */
/* <input type="hidden" name="sound" value="ext">           */
/* <textarea name="program" readonly="readonly">            */
/* ЗДЕСЬ НАХОДИТСЯ ТЕКСТ ПРОГРАММЫ                          */
/* </textarea>                                              */
/* <br><input type="submit" value="Выполнить">              */
/* </form>                                                  */
/*                                                          */
/* Пример HTML-формы для передачи условия задачи:           */
/*                                                          */
/* <form action=".../index.php" method="post">              */
/* <input type="hidden" name="lang" value="ru">             */
/* <input type="hidden" name="sound" value="ext">           */
/* <input type="hidden" name="task value="...ЗУЗ...">       */
/* <p>Задача. (Здесь приводится описание задачи)</p>        */
/* <input type="submit" value="Приступить">                 */
/* </form>                                                  */
/*                                                          */
/* где  ...ЗУЗ...  - закодированное условие задачи, которое */
/* можно подготовить в среде ГРИС «Букашка».                */
/*==========================================================*/
$subst = array ();
$varsound = array ('off' => '0', 'no' => '0', 'ext' => '2', 'adv' => '2');
$html = file_get_contents ('index.html');
if (array_key_exists ('lang', $_POST) and mb_strlen ($_POST['lang']) < 6):
	$subst['/* app.lang */'] = 'app.lang = "' . strtr ($_POST['lang'], '<>"\'`:/\\', '        ') . '";';
endif;
if (array_key_exists ('sound', $_POST) and mb_strlen ($_POST['sound']) < 6 and array_key_exists ($_POST['sound'], $varsound)):
	$subst['/* app.sound */'] = 'app.sound = ' . $varsound[$_POST['sound']] . ';';
endif;
if (array_key_exists ('program', $_POST)):
	$subst['PROGRAM_HERE'] = strtr ($_POST['program'], '<>"\'`:/\\', '        ');
	$subst['/* app.mode */'] = 'app.mode = 2;';
endif;
if (array_key_exists ('task', $_POST)):
	$subst['/* app.task */'] = 'app.task = "' . strtr ($_POST['task'], '<>"\'`:/\\', '        ') . '";';
	$subst['/* app.mode */'] = 'app.mode = 1;';
endif;
echo strtr ($html, $subst);
?>