<? 
// ----------------------------конфигурация-------------------------- // 
 
$adminemail="mygachovs@gmail.com";  // e-mail админа 
$date=date("d.m.y"); // число.месяц.год 
$time=date("H:i"); // часы:минуты:секунды 
$backurl="/thanks.html";  // На какую страничку переходит после отправки письма
 
//---------------------------------------------------------------------- // 
 
// Принимаем данные с формы 
$email=$_POST['email']; 
$phone=$_POST['phone']; 
$msg=$_POST['message']; 
 
// Проверяем валидность e-mail 
 
if (!preg_match("|^([a-z0-9_\.\-]{1,20})@([a-z0-9\.\-]{1,20})\.([a-z]{2,4})|is", 
strtolower($email))) 
 
 { 
 
  echo 
"<center>Вернитесь <a 
href='javascript:history.back(1)'><B>назад</B></a>. Вы 
указали неверные данные!"; 
 
  } 
 
 else 
 
 { 
 
$msg=" 

E-mail пользователя: $email

Телефон пользователя: $phone

"; 
 
 // Отправляем письмо админу  
 
mail("$adminemail", "$date $time Поступил новый обратный звонок", "$msg"); 
 
  
 
// Сохраняем в базу данных 
 
$f = fopen("message.txt", "a+"); 
fwrite($f," \n $date $time Сообщение от $phone"); 
fwrite($f,"\n $msg "); 
fwrite($f,"\n ---------------"); 
fclose($f); 
 
  
 
// Выводим сообщение пользователю 
 
print "<script language='Javascript'><!-- 
function reload() {location = \"$backurl\"}; setTimeout('reload()', 0000); 
//--></script> 
 
";  
exit; 
 
 } 
 
 
?>