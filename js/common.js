$(document).on('click', '.menu > a', menuMove);
$(document).on('click', '.panel > div > a', panelBtn);
$(document).on('mouseleave', '.canvas', resetGrid);
$(document).on('mousedown mouseup', '.canvas', drawGrid);
$(document).on('mousemove', '.canvas', realtimeGrid);
$(document).on('click', '.grid-table', selectMap);
$(document).on('click', '#save', saveMap);
$(document).on('click', '#delete', deleteMap);
$(document).on('click', '#layout-submit', submitMap);
$(document).on('click', '.tag > a', deleteTag);
$(document).on('keydown', '.input-tag', addTag);
$(document).on('mouseenter mouseleave', '.canvas', toggleGrid);
$(document).on('click', '.reserve #map_1', function(){ $('#res_s').show(); });
$(document).on('click', '.layoutmap .grid-table', custTable);

function custTable(){
	if (!$(this).hasClass('grid-unavailable')) {
		$(this).addClass('selected');
		$('.customerdata').addClass('active');
	}
	else alert('Not Available');
	return false;
}

$(document).on('click', '.gnb > a', contentSwap);
$(document).on('click', '#proceed', proceed);
$(document).on('click', '.btn-book', book);
$(document).on('click', '.btn-finish', finish);

function finish(){
	$('.result').remove();
	$('.finished').show();
}

function book(){
	if ($('#reserve-date').val().length > 0) {
		$('.reserve3').addClass('bookresult');
		$('.customerdata').removeClass('active');
		$('#book-name-out').text($('#book-name').val() + ' ('+$('#book-seats').val()+')');
		$('#book-phone-out').text($('#book-phone').val());
		$('#book-datetime-out').text($('#reserve-date').val() + ', ' +$('#reserve-time1 option:selected').text() +' - '+$('#reserve-time2 option:selected').text());
		if ($('#book-vallet').prop('checked'))
			$('#book-need-out').text('Need a Vallet');
		$('.reserve2').hide();
	} else alert('You have to select the date.');
	
	return false;
}

function proceed(){
	$('.mobile').addClass('phase2');
	$('.layoutmap').css({ height:parseInt($('.layoutmap').width()) * 0.81 });
	$('#imported .gridmap').each(function(){
		_w = parseInt($(this).width()) / 540 * 100;
		_h = parseInt($(this).height()) / 440 * 100;
		_t = parseInt($(this).css('top')) / 440 * 100;
		_l = parseInt($(this).css('left')) / 540 * 100;
		$(this).css({
			width: _w + '%',
			height: _h + '%',
			top: _t + '%',
			left: _l + '%'
		});
	});
	$('.layoutmap').html($('#imported').html());
	$('.layoutmap').find('.selected').removeClass('selected');
}
function toggleGrid(e){ // Show & Hide Grid
	if (e.type == 'mouseenter' && $('.ui-draggable-dragging').length == 0) $(this).addClass('active');
	else {
		$(this).removeClass('active');
		resetGrid();
	}
}
function contentSwap(){
	$(this).siblings().removeClass('bbgray');
	$(this).addClass('bbgray');
	$('.content').removeClass('active').eq($(this).index()).addClass('active');
}

function addTag(e){
	if(e.keyCode == 13 || e.keyCode == 32) {
		$('.input-tag-label').before('<p class="tag">#'+$('.input-tag').val()+'<a href="#">x</a></p>');
		$('.input-tag').val('');
        return false;
    }
}

function deleteTag(){
	$(this).parent().remove();
	return false;
}

var testhtml = '';
var x, y;

function submitMap(){
	testhtml = $('.canvas').html();
	$('.rescanvas').html(testhtml);
	$('.rescanvas').find('.selected').removeClass('selected');
	$('#imported').html(testhtml);
	/*	$('#res_tblno').text($('.selected').attr('id').split('map_')[1]);*/
}

function realtimeGrid(e){
	x = parseInt(e.pageX - $(this).offset().left);
	y = parseInt(e.pageY - $(this).offset().top);
	$('.axis.x.active').css({ left: x });
	$('.axis.y.active').css({ top: y });
}

function menuMove(){
	_idx = $(this).index();
	$(this).addClass('active').siblings().removeClass('active');
	$('.page').removeClass('active').eq(_idx).addClass('active');
	return false;
}

function panelBtn(){
	$('.panel > div > a').removeClass('active');
	$(this).addClass('active');
	gridtype = $(this).attr('class').split('btn-')[1].split(' ')[0];
	console.log(gridtype)
	return false;
}

var gridtype = 'floor';
var start, end;
var phase = 0;

function drawGrid(e){
	var mouseX = parseInt(e.pageX - $(this).offset().left);
	var mouseY = parseInt(e.pageY - $(this).offset().top);
	if ((e.type == 'mousedown' && phase == 0) && !$(e.target).hasClass('grid-table')){
		start = { x: mouseX, y: mouseY };
		phase = 1;
		$('.axis.a').removeClass('active');
	} else if (phase == 1) {
		end = { x: mouseX, y: mouseY };
		phase = 0;
		$('.axis.a').addClass('active');
		if (Math.abs(start.x-end.x) > 10 && Math.abs(start.y-end.y) > 10) createGrid(start, end);
	}
}

function editMap(){
	var _id = $('.selected').attr('id').split('map_')[1];
	$('#mapid').val(_id);
	$('#capa').val($('.selected').text());
}

function saveMap(){
	$('.selected').text($('#capa').val());
	$('.selected').attr('id', 'map_'+$('#mapid').val());
}

function deleteMap(){
	$('.selected').remove();
}

function resetGrid(){
	phase = 0;
}
function selectMap(){ // Select Map Element
	$('.grid-table').removeClass('selected');
	$(this).addClass('selected');
	$('.panel-table').addClass('active');
	editMap();
	$('#res_tblno').text($('.selected').attr('id').split('map_')[1]);
}
function createGrid(sp, ep){
	var width = Math.abs(sp.x-ep.x);
	var height = Math.abs(sp.y-ep.y);
	var left = Math.min(sp.x, ep.x);
	var top = Math.min(sp.y, ep.y);
	var mapId = $('.grid-table').length + 1;
	var gridflag = (gridtype == 'bookable' || gridtype == 'unavailable' || gridtype == 'viponly') ? 'grid-table' : 'grid-layout';
	
	while($('#map_'+mapId).length > 0){
		mapId++;
	}
	
	if (gridflag == 'grid-table'){
		$('.canvas').append('<a href="javascript:;" id="map_'+mapId+'" class="gridmap grid-'+gridtype+' '+gridflag+'" style="width:'+width+'px; height:'+height+'px; top:'+top+'px; left:'+left+'px; padding:2px 0 0 2px; font-size:12px;">4</a>');
		$('.grid-table').removeClass('selected');
		$('.panel-table').addClass('active');
		$('#map_'+mapId).addClass('selected').draggable({ containment: '.canvas' });
		editMap();
	} else {
		$('.canvas').append('<div class="gridmap grid-'+gridtype+' '+gridflag+'" style="width:'+width+'px; height:'+height+'px; top:'+top+'px; left:'+left+'px;"></div>');
	}
}