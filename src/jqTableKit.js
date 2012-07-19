/*
 * Copyright (c) 2011-2012 Carl Asman http://www.edlin.org/
 * Version: 0.25 2012-07-19
 * 
 * TableKit ported to jQuery
 * (part of a project I have done for a client of mine)
 * 
 * You can reach me at www.edlin.org
 * if you want to contact me regarding potential projects.
 * 
 * jqTableKit's aim is to provide the same functionality, in the same way
 * as TableKit, but using jQuery instead of prototype
 * 
 * The original TableKit is Copyright Andrew Tetlaw & Millstream Web Software
 * http://www.millstream.com.au/view/code/tablekit/
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

(function($) {
	
	var debugLog = function(msg){
		console.log(msg);
	}
	
	/**
	 * based on the typeIndex it determines how to format the data
	 */
	 var formatKey = function(data, typeIndex) {
		switch (typeIndex) {
		case 0:
			// date-iso
			return formatDateIso(data);
		case 1:
			// date
			if (data) {
				var pattern = /^(?:sun|mon|tue|wed|thu|fri|sat)\,\s\d{1,2}\s(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s\d{4}(?:\s\d{2}\:\d{2}(?:\:\d{2})?(?:\sGMT(?:[+-]\d{4})?)?)?/i; //Mon, 18 Dec 1995 17:28:35 GMT
				if (!data.match(pattern)) {
					return 0;
				}
				return new Date(data);
			} else {
				return 0;
			}
		case 2:
			// date-eu
			return formatDateEu(data);
		case 3:
			// date-au
			return formatDateAu(data);
		case 4:
			// time
			var d = new Date();
			var ds = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear() + " ";
			return new Date( ds + data);
		case 5:
			// currency
			return data ? parseFloat(data.replace(/[^-\d\.]/g, '')) : 0;
		case 6:
			// datasize
			return formatDatasize(data);
		case 7:
			// number
			data = parseFloat(data.replace(/^.*?([-+]?[\d]*\.?[\d]+(?:[eE][-+]?[\d]+)?).*$/,"$1"));
			return isNaN(data) ? 0 : data;
		case 8:
			// casesensitivetext
			return data;
		case 9:
			return data.toUpperCase();
		default:
			return 0;
		}
	};

	var formatDateEu = function(v) {
		var pattern = /^\d{1,2}-\d{1,2}-\d{4}/i; //31-12-1999, 5-5-1999
		if (!v.match(pattern)) {
			return 0;
		}
		var r = v.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
		var yr_num = r[3];
		var mo_num = parseInt(r[2], 10) - 1;
		var day_num = r[1];
		return new Date(yr_num, mo_num, day_num).valueOf();
	}

	var formatDateIso = function(v) {

		var pattern = /[\d]{4}-[\d]{2}-[\d]{2}(?:T[\d]{2}\:[\d]{2}(?:\:[\d]{2}(?:\.[\d]+)?)?(Z|([-+][\d]{2}:[\d]{2})?)?)?/; // 2005-03-26T19:51:34Z

		if (!v.match(pattern)) {
			return 0;
		}
		var d = v
				.match(/([\d]{4})(-([\d]{2})(-([\d]{2})(T([\d]{2}):([\d]{2})(:([\d]{2})(\.([\d]+))?)?(Z|(([-+])([\d]{2}):([\d]{2})))?)?)?)?/);
		var offset = 0;
		var date = new Date(d[1], 0, 1);
		if (d[3]) {
			date.setMonth(d[3] - 1);
		}
		if (d[5]) {
			date.setDate(d[5]);
		}
		if (d[7]) {
			date.setHours(d[7]);
		}
		if (d[8]) {
			date.setMinutes(d[8]);
		}
		if (d[10]) {
			date.setSeconds(d[10]);
		}
		if (d[12]) {
			date.setMilliseconds(Number("0." + d[12]) * 1000);
		}
		if (d[14]) {
			offset = (Number(d[16]) * 60) + Number(d[17]);
			offset *= ((d[15] === '-') ? 1 : -1);
		}
		offset -= date.getTimezoneOffset();
		if (offset !== 0) {
			var time = (Number(date) + (offset * 60 * 1000));
			date.setTime(Number(time));
		}
		return date.valueOf();

	}

	var formatDateAu = function(v) {
			var pattern = /^\d{2}\/\d{2}\/\d{4}\s?(?:\d{1,2}\:\d{2}(?:\:\d{2})?\s?[a|p]?m?)?/i; //25/12/2006 05:30:00 PM
						
			if (!v.match(pattern)) {
				return 0;
			}
			var r = v.match(/^(\d{2})\/(\d{2})\/(\d{4})\s?(?:(\d{1,2})\:(\d{2})(?:\:(\d{2}))?\s?([a|p]?m?))?/i);
			var yr_num = r[3];
			var mo_num = parseInt(r[2],10)-1;
			var day_num = r[1];
			var hr_num = r[4] ? r[4] : 0;
			if(r[7]) {
				var chr = parseInt(r[4],10);
				if(r[7].toLowerCase().indexOf('p') !== -1) {
					hr_num = chr < 12 ? chr + 12 : chr;
				} else if(r[7].toLowerCase().indexOf('a') !== -1) {
					hr_num = chr < 12 ? chr : 0;
				}
			} 
			var min_num = r[5] ? r[5] : 0;
			var sec_num = r[6] ? r[6] : 0;
			return new Date(yr_num, mo_num, day_num, hr_num, min_num, sec_num, 0).valueOf();
		}

	var formatDatasize = function(v) {
		var r = v.match(/^([-+]?[\d]*\.?[\d]+([eE][-+]?[\d]+)?)\s?([k|m|g|t]?b)?/i);
		var b = r[1] ? Number(r[1]).valueOf() : 0;
		var m = r[3] ? r[3].substr(0, 1).toLowerCase() : '';
		var result = b;
		switch (m) {
		case 'k':
			result = b * 1024;
			break;
		case 'm':
			result = b * 1024 * 1024;
			break;
		case 'g':
			result = b * 1024 * 1024 * 1024;
			break;
		case 't':
			result = b * 1024 * 1024 * 1024 * 1024;
			break;
		}
		return result;
	}

	var functionSortTmp = function(a, b, index) {
		var sortKey = 'sortKey' + index;
		if ($(a).data(sortKey) < $(b).data(sortKey)) {
			return -1;
		}
		if ($(a).data(sortKey) > $(b).data(sortKey)) {
			return 1;
		}
		return 0;
	};

	/**
	 * Auto detect the type
	 */
	var detectType = function(data){
		var typeIndex=-1;
		for (var i=0;i< sortLength;i++){
			switch (sortTypes[i]) {
			case 'date-iso':
				if(data.match(typePatterns['date-iso'])){
					return i;
				}
				break;	
			case 'date':
				if(data.match(typePatterns['date'])){
					return i;
				}
				break;	
			case 'date-eu':
				if(data.match(typePatterns['date-eu'])){
					return i;
				}
				break;	
			case 'date-au':
				if(data.match(typePatterns['date-au'])){
					return i;
				}
				break;	
			case 'time':
				if(data.match(typePatterns['time'])){
					return i;
				}
				break;
			case 'currency':
				if(data.match(typePatterns['currency'])){
					return i;
				}
				break;
			case 'datasize':
				if(data.match(typePatterns['datasize'])){
					return i;
				}
				break;
			case 'number':
				if(data.match(typePatterns['number'])){
					return i;
				}
				break;
			default:
			}
		}
		if(typeIndex <0){
			//default to text
			return 9;			
		}
		return typeIndex;
	}
		
	// determine the header type for each column
	var sortTypes = [ 'date-iso', 'date', 'date-eu', 'date-au', 'time', 'currency', 'datasize', 'number', 'casesensitivetext', 'text' ];
	//pattern used for automatic detections
	var typePatterns = {	'date-iso' : /[\d]{4}-[\d]{2}-[\d]{2}(?:T[\d]{2}\:[\d]{2}(?:\:[\d]{2}(?:\.[\d]+)?)?(Z|([-+][\d]{2}:[\d]{2})?)?)?/, // 2005-03-26T19:51:34Z
												'date': /^(?:sun|mon|tue|wed|thu|fri|sat)\,\s\d{1,2}\s(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s\d{4}(?:\s\d{2}\:\d{2}(?:\:\d{2})?(?:\sGMT(?:[+-]\d{4})?)?)?/i, //Mon, 18 Dec 1995 17:28:35 GMT
												'date-eu': /^\d{1,2}-\d{1,2}-\d{4}/i,
												'date-au': /^\d{2}\/\d{2}\/\d{4}\s?(?:\d{1,2}\:\d{2}(?:\:\d{2})?\s?[a|p]?m?)?/i,
												'time': /^\d{1,2}\:\d{2}(?:\:\d{2})?(?:\s[a|p]m)?$/i,
												'currency': /(^[$¥£€¤])|([€]$)/, // dollar,pound,yen,euro,generic currency symbol
												'datasize': /^[-+]?[\d]*\.?[\d]+(?:[eE][-+]?[\d]+)?\s?[k|m|g|t]b$/i, 
												'number': /^[-+]?[\d]*\.?[\d]+(?:[eE][-+]?[\d]+)?$/ };
	var sortLength = sortTypes.length;

	
	// resize functions 
	
	/**
	 * calculate if the x-value is within the "draggable" area
	 */
	var isInDragArea = function (elem, pX){
		//debugLog("elemLeftBorder="+ (elem.offset().left + elem.outerWidth(true)) + ", pX="+pX);	
		if( ( elem.offset().left + elem.outerWidth(true) - pX) > 10 ){
			return false ;
		}
		return true;
	}

	var resizeChangeCursor = function (elem, pX){
		if( isInDragArea(elem, pX) ){
			elem.addClass("resize-handle-active");
			return;
		};
		elem.removeClass("resize-handle-active");
	};

	var resizeHideDiv = function (){
		if(resizeDiv){
			$('.resize-handle').remove();
			resizeDiv=null;
		}	
	}

	//resizable vqrs
	var sortingEnabled=true;
	var resizeDiv=null;
	
	var methods = {
		init : function(options) {

			var settings = {
				'stripe' : true,
				'rowEvenClass' : 'roweven',
				'rowOddClass' : 'rowodd',
				'minWidth' : 10
			};

			return this.each(function() {
				
				if ( options ) { 
					$.extend( settings, options );
				}

				var optionSortable=$(this).hasClass('sortable');
				var optionResizable=$(this).hasClass('resizable');
				
				var headerTypeIndexes = [];

				// Determine the types of each row
				var headerRows = $(this).children('thead').children('tr');
				
				var ignoreFirstRow=false;

				if (0 == headerRows.length) {
					//set flag that first tr shall be ignored
					ignoreFirstRow=true;
					// just take first row from this table
					headerRows = $(this).find('> tbody > tr:first, > tr:first');
				}
				var headCols = headerRows.find('> td, > th');

				
				if(optionResizable){
					//start resize init code
					headCols.bind('mousemove.jqTableKit_resize', function(e) {
						resizeChangeCursor($(this), e.pageX);
					});
	
					headCols.bind('mousedown.jqTableKit', function(e) {
						if( ! isInDragArea($(this), e.pageX) ){
							return;
						}
						var downElement = $(this);
													
						//display resize div
						var pX = e.pageX;
						if(null === resizeDiv){
							resizeDiv = $('<div />');
							var closestTable = downElement.closest("table");								
							
							resizeDiv.addClass('resize-handle').css('top', downElement.offset().top).css('left', pX + 'px').css('height', closestTable.height());			
															
							$('body').append(resizeDiv);
							downElement.addClass("resize-handle-active");

							//TODO: find better solution than all elements
							if ($.browser.msie) {	
								$('*').attr('unselectable', 'on');
							}else{
								$('*').addClass('jqTableKitNoneselectable');
							}
						}
	
						sortingEnabled=false;
	
						headCols.unbind('mousemove.jqTableKit_resize');
														
						$(document).bind('mousemove.jqTableKit_moveresizediv', function(f) {
							resizeDiv.css('left', f.pageX + 'px');
						});
	
						$(document).bind('mouseup.jqTableKit', function(e) {
							
							resizeHideDiv();
							headCols.removeClass("resize-handle-active");
													
							var cellWidth = downElement.outerWidth(true);
							var change = downElement.offset().left + cellWidth - e.pageX;
							
							change = Math.max(settings['minWidth'], downElement.width() - change);
							downElement.width( change );
															
							$(document).unbind('mouseup.jqTableKit');
							
							$(document).unbind('mousemove.jqTableKit_moveresizediv');
							headCols.bind('mousemove.jqTableKit_resize', function(e) {
								resizeChangeCursor($(this), e.pageX);
							});
	
							if ($.browser.msie) {	
								$('*').attr('unselectable', 'off');
							}else{
								$('*').removeClass('jqTableKitNoneselectable');
							}

							//enable click handler
							sortingEnabled=true;
						});
					});						
					// end resize code
				}
				
				
				if(! optionSortable){
					return;
				}
				
				//init sortable code
				$.each(headerRows, function(index, row) {
					var headerTypeIndexesCnt = 0;
					var matchIndex = -1;
					var headerCols = $(row).find('> td, > th');
					
					$.each(headerCols, function(indexHeaderCol, headerCol) {
							
						if(! $(headerCol).hasClass("nosort")){

							$(headerCol).addClass("sortcol");
							
							// extract ids to see if they match
							for ( var i = 0; i < sortLength; ++i) {
								if (sortTypes[i] == headerCol.id) {
									matchIndex = i;
									break;
								}
							}
							// if no match, extract class names to see if they match
							if (matchIndex < 0) {
								for ( var i = 0; i < sortLength; ++i) {
									if ($(headerCol).hasClass(sortTypes[i])) {
										matchIndex = i;
										break;
									}
								}
							}
							headerTypeIndexes[headerTypeIndexesCnt++] = matchIndex;
							matchIndex = -1;
						}else{
							headerTypeIndexesCnt++
						}
					});
				});

				// get all rows below tbody or table, and maybe skip first one
				var rows = $(this).children('tbody').children('tr');

				// pre calcuate search keys
				// for each column we now calculate a sortKey which is the the text in
				// uppercase
				var analyzeFirstRowContent = true;
				$.each(rows, function(index, row) {
					var cols = $(row).children('td');
					var colIndex = 0;

					if(index > 0 || ! ignoreFirstRow){
						$.each(cols, function(indexCol, col) {

							//if first row with content, check if need to automatic detect type
							//for any header
							if(analyzeFirstRowContent){
								if(headerTypeIndexes[colIndex] < 0 && ! $(col).hasClass("nosort")){
									//detect type
									headerTypeIndexes[colIndex] = detectType($(col).text());
								}
							}
							
							$(row).data('sortKey' + colIndex, formatKey($(col).text(), headerTypeIndexes[colIndex]));
							
							colIndex++;
						});
						
						analyzeFirstRowContent=false;
					}
				});

				var preSortAsc=null;
				var preSortDesc=null;
				var colIndex = 0;
				$.each(headCols, function(index, headCol) {

					if (!$(headCol).hasClass('nosort')) {

						if( $(headCol).hasClass("sortfirstasc") ){
							preSortAsc=$(headCol);
						}else{
							if( $(headCol).hasClass("sortfirstdesc") ){
								preSortDesc=$(headCol);
							}
						}

						$(headCol).bind('click.jqTableKit', function() {
							if(!sortingEnabled){
								return;
							}

							var sortAsc=true;
							if($(headCol).hasClass('sortasc')){
								cssClassToAdd = 'sortdesc';
								sortAsc=false;
							}else{
								cssClassToAdd = 'sortasc';
							}
							
							//remove sortasc/sortdesc classes
							headerRows.find('> td, > th').removeClass("sortdesc").removeClass("sortasc");
							
							$(headCol).addClass(cssClassToAdd);
							
							var closestTable = $(this).closest("table");
							var trs = closestTable.find('tr');
							
							if(settings['stripe']){
								trs.filter(":odd").removeClass(settings['rowOddClass']);
								trs.filter(":even").removeClass(settings['rowEvenClass']);
							}
							
							if (sortAsc) {
								closestTable.jqTableKit('sort', ignoreFirstRow, function(a, b) {
									return functionSortTmp(a, b, index);
								});
							} else {
								closestTable.jqTableKit('sort', ignoreFirstRow, function(a, b) {
									return functionSortTmp(b, a, index);
								});
							}

							if(settings['stripe']){
								//turn on row striping
								trs = closestTable.find('tr');
								trs.filter(":odd").addClass(settings['rowOddClass']);
								trs.filter(":even").addClass(settings['rowEvenClass']);
								trs.filter(":first").removeClass(settings['rowEvenClass']);
							}
						});
					};
				});

				if(settings['stripe']){
					//turn on row striping
					$(this).find('tr').filter(":odd").addClass(settings['rowOddClass']);
					$(this).find('tr').filter(":even").addClass(settings['rowEvenClass']);
					$(this).find('tr').filter(":first").removeClass(settings['rowEvenClass']);
				};
				
				if(preSortAsc){
					preSortAsc.removeClass('sortasc').removeClass('sortdesc').addClass('sortdesc').click();
				}else{
					if(preSortDesc){
						preSortDesc.removeClass('sortasc').removeClass('sortdesc').addClass('sortasc').click();
					}
				}
					
			});

		},
		destroy : function() {

			return this.each(function() {
				//remove classes?
				
				//resize cleanup
				$('th').unbind('.jqTableKit_resize');
				$('td').unbind('.jqTableKit_resize');
				$('th').unbind('.jqTableKit');
				$('td').unbind('.jqTableKit');
				
				//sortable cleanup
				//remove click handlers, could be optimized to pick out header row
				//$('td').unbind('click.jqTableKit');				
				//$('th').unbind('click.jqTableKit');				
								
				var rows = $(this).children('tbody').children('tr');

				//the data is attached to each row, we must however find out how many columns we have to be able to remove the data
				var processedOne = false;
				var numberOfCols=0;
				$.each(rows, function(index, row) {
					if(! processedOne){
						var aCol = $(row).find('> td, > th');
						numberOfCols = aCol.length;
					}
					
					//loop and destroy each sortKey
					for(var i=0; i<numberOfCols;i++){
						$(row).removeData('sortKey' +i);
					};
				});				
			});
		},
		sort : function(ignoreFirstRow, sortMethod) {

			return this.each(function() {
				// in case someone attach it to some other element
				if ("table" != this.nodeName.toLowerCase()) {
					return;
				}

				// make sure only fetch child tbody tr of "this"
				var rows;

				if(ignoreFirstRow){
					// make sure only fetch child tbody tr of "this"
					rows = $(this).children('tbody').children('tr').not(':first');
				}else{
					rows = $(this).children('tbody').children('tr');
				}
				
				rows.sort(sortMethod);
				$(this).children('tbody').append(rows);
			});
		},
		/** return array with functions that we want to unit test */
		unitTestHelper : function( ) {
			var unitTest = {};
			unitTest['formatKey'] = formatKey;
			unitTest['detectType'] = detectType;
			return unitTest;
		}

	};

	$.fn.jqTableKit = function(method) {

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments,
					1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.jqTableKit');
		}
	};

})(jQuery);

jQuery(document).ready(function() {
	//delay init, since it performs quite many calculations
	setTimeout(function(){jQuery('table').jqTableKit();}, 100);
});

