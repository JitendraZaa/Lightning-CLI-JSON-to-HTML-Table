"use strict";
 var arrResult = [];
 var sortIndex = null;
 var prevSortOrder = null;
 var globalSortDir_ASC = true;
 
$(document).on('blur', '#txtJSON', function () {
	if( window.localStorage ) { 
		var txtJSON = $(this).val();
		localStorage.setItem("prevJSON" , txtJSON);
		console.log('Text Area data saved in local storage');
	} 
});

$( document ).ready(function() {
	var prevJSON = localStorage.getItem('prevJSON');
	if(prevJSON && window.localStorage ){
		$("#txtJSON").val(prevJSON);
		console.log('Previous Text area data retreived from local storage');
	} 
});
 

$( "#btnConvert" ).click(function() { 
  $("#pseudoElement").removeClass("hide");
  $("#waterMark").removeClass("hide");
  var txtJSON = $("#txtJSON").val(); 
  if(txtJSON){
	  $.each(JSON.parse(txtJSON), function(i, obj) { 
	  //console.log(obj);
	  if(obj.result && obj.result.length > 0){
		  
		  $.each(obj.result, function( index, value ) {
			  var codeReview = {
					column:parseInt(value.column),
					fatal: value.fatal ? value.fatal : false,
					line:parseInt(value.line),
					message:value.message,
					ruleId : value.ruleId,
					severity : parseInt(value.severity),
					source : value.source,
					file : obj.file.substring(obj.file.lastIndexOf("\\") + 1)
				};
				arrResult.push(codeReview); 
		}); 
	  } 
	}); 
	objectToTable(arrResult,null,null);
	document.getElementById('pseudoElement').scrollIntoView();  
  }
  
});

function objectToTable(arrResult,sortIndex,direction){
	var sortText = ''; 
	
	if(direction === 'asc'){
		sortText = '<span class="glyphicon glyphicon-triangle-top" aria-hidden="true" style="padding-right: 5px"></span>';
	}else if(direction === 'desc'){
		sortText = '<span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true" style="padding-right: 5px"></span>';
	}
	
	var container = $('#result');
	container.html("");
	var table = $('<table  class="table table-bordered table-hover">');
	var thead = $('<thead>');
	var tr_thead = $('<tr>');
	['FileName', 'Message', 'Code','Line Number','Coulmn Number','Severity','is Fatal','Rule Id'].forEach(function(attr,index) { 
		if(index === sortIndex){
			tr_thead.append('<th class="sortable" onclick="sortTable('+index+')">' +sortText+ attr + '</th>');
		}else{
			tr_thead.append('<th class="sortable" onclick="sortTable('+index+')">' + attr + '</th>');
		} 
	});
	thead.append(tr_thead);
	table.append(thead);
	
	var tBody = $('<tbody>');
	arrResult.forEach(function(row){
		var tr = $('<tr>');
		tr.append('<td>'+ row.file + '</td>');
		tr.append('<td>' + row.message + '</td>');
		tr.append('<td> <code>' + row.source + '</code></td>');
		tr.append('<td>' + row.line + '</td>');
		tr.append('<td>' + row.column + '</td>');
		tr.append('<td>' + row.severity + '</td>');
		tr.append('<td>' + row.fatal + '</td>');
		tr.append('<td>' + row.ruleId + '</td>');
		tBody.append(tr); 
	});
	table.append(tBody);
	container.append(table);
}
 
function sortTable(index){
	//its same column sorting
	var sortOrder = 'asc';
	globalSortDir_ASC = true;
	if(sortIndex === index){
		if(prevSortOrder === 'asc'){
			sortOrder='desc';
			globalSortDir_ASC = false;
		}		
	}
	sortIndex = index;
	prevSortOrder = sortOrder;
	arrResult.sort(sortArrayCustom);
	objectToTable(arrResult,index,sortOrder);
}

function sortArrayCustom(a, b)
{
	
	var a1 , b1 = null;
	switch(sortIndex){
		case 0:	a1 = a.file , b1=b.file; break ;
		case 1:	a1 = a.message , b1=b.message; break ;
		case 2:	a1 = a.source , b1=b.source; break ;
		case 3:	a1 = a.line , b1=b.line; break ;
		case 4:	a1 = a.column , b1=b.column; break ;
		case 5:	a1 = a.severity , b1=b.severity; break ;
		case 6:	a1 = a.fatal , b1=b.fatal; break ;
		case 7:	a1 = a.ruleId , b1=b.ruleId; break ;
	}
	 
	
	if(globalSortDir_ASC){
		if (a1 < b1) return -1;
		if (a1 > b1) return 1;
		return 0;
	}else{
		if (a1 > b1) return -1;
		if (a1 < b1) return 1;
		return 0;
	}
  
}

function printResult(){ 
	
	var divToPrint=document.getElementById('printArea'); 
	var newWin=window.open('','Print-Window');

	newWin.document.open(); 
	newWin.document.write('<html><head><meta http-equiv="content-type" content="text/html;charset=UTF-8" /></head><body onload="window.print()">'+divToPrint.innerHTML+'<link rel="stylesheet" type="text/css" href="css/main.css" media="screen,print"><link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet"  crossorigin="anonymous"  media="screen,print"> </link></body></html>'); 
	newWin.document.close(); 
	setTimeout(function(){newWin.close();},1000);
  
}

	