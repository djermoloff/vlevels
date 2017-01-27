<script src="libs/jquery/jquery-2.1.4.min.js"></script>
<form action="php/Anal.php" method="post" target="_blank">
<input text="text" id="n1" name="" value="" onKeyUp="rename(1)" />=<input text="text" id="v1" name="" value="" /><br>
<input text="text" id="n2" name="" value="" onKeyUp="rename(2)" />=<input text="text" id="v2"name="" value="" /><br>
<input text="text" id="n3" name="" value="" onKeyUp="rename(3)" />=<input text="text" id="v3" name="" value="" /><br>
<input text="text" id="n4" name="" value="" onKeyUp="rename(4)" />=<input text="text" id="v4"name="" value="" /><br>
<input text="text" id="n5" name="" value="" onKeyUp="rename(5)" />=<input text="text" id="v5" name="" value="" /><br>
<input text="text" id="n6" name="" value="" onKeyUp="rename(6)" />=<input text="text" id="v6"name="" value="" /><br>
<input text="text" id="n7" name="" value="" onKeyUp="rename(7)" />=<input text="text" id="v7" name="" value="" /><br>
<input text="text" id="n8" name="" value="" onKeyUp="rename(8)" />=<input text="text" id="v8"name="" value="" /><br>
<input text="text" id="n9" name="" value="" onKeyUp="rename(9)" />=<input text="text" id="v9" name="" value="" /><br>
<input text="text" id="n10" name="" value="" onKeyUp="rename(10)" />=<input text="text" id="v10"name="" value="" /><br>
<input type="submit" value="Отправить" />
</form>
<script>
function rename(id)
	{
	var v = $("#n"+id).val();
	$("#v"+id).attr("name", v);
	}
</script>