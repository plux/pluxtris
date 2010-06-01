function loadXMLDoc()
{
    xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
	    document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
	}
    }
    xmlhttp.open("POST","ajaxresponse",true);
    xmlhttp.send(JSON.stringify({update: {player: 1, field: [1,2,3]}}));
}

