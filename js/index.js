function spiritedAwayPoster(){
	document.getElementById('movie').innerHTML="<img src='./images/train.gif'/>";
}

function totoroPoster(){
	document.getElementById('movie').innerHTML="<img src='./images/totoroRain.gif'/>";
}

function kikiPoster(){
	document.getElementById('movie').innerHTML="<img src='./images/kiki.gif'/>";
}

function clearPoster(){
	document.getElementById('movie').innerHTML="";
}


window.onload=function(){
	document.getElementById('spiritedAway').addEventListener('mouseover', spiritedAwayPoster);
	document.getElementById('spiritedAway').addEventListener('mouseout', clearPoster);

	document.getElementById('totoro').addEventListener('mouseover', totoroPoster);
	document.getElementById('totoro').addEventListener('mouseout', clearPoster);

	document.getElementById('kiki').addEventListener('mouseover', kikiPoster);
	document.getElementById('kiki').addEventListener('mouseout', clearPoster);
}



