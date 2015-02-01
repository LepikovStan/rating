$(function() {
	$('.newplayer button').on('click', function() {
		var data = {},
			rangs = ['Новичок', 'Любитель', 'Эксперт', 'Мастер', 'Грандмастер'];
	
		$('input, select').each(function(i, el) {
			if ($(el).attr('type') === 'checkbox') {
				data[$(el).attr('name')] = $(el).prop('checked');
			} else {
				data[$(el).attr('name')] = $(el).val();
			}
		});
	
		$.post('/player/new', data, function(data) {
			var html = '<tr><th>№</th><th>Имя</th><th>Город</th><th>Кол-во турниров</th><th>Кол-во турниров в сезоне</th><th>Кол-во игр</th><th>Побед</th><th>Поражений</th><th>% побед</th><th>Рейтинг</th><th>Ранг</th></tr>',
				place = 0;
			
			$.each(data.rows, function(i, el) {
				var placeDiffClass = 'placeDiff ';
				
				if (el.active) {
					place = place + 1;
					el.place = place;
				}
				
				if (el.placeDiff > 0) {
					placeDiffClass == 'positive';
				}
				else if (el.placeDiff < 0) {
					placeDiffClass += 'negative';
				}
			
				html += '<tr class="'+ (el.active ? '' : 'nonactive') +'">'+
					'<td><div class="'+placeDiffClass+'"><span>'+ (el.placeDiff > 0 ? '+' + el.placeDiff : el.placeDiff) +'</span>'+ (el.active ? place : '') +'</div></td>'+
					'<td>'+ unescape(el.firstname) + ' ' + unescape(el.lastname) +'</td>'+
					'<td>'+ unescape(el.city) +'</td>'+
					'<td>'+ el.tournaments +'</td>'+
					'<td>'+ el.seasonTournaments +'</td>'+
					'<td>'+ el.games +'</td>'+
					'<td>'+ el.wins +'</td>'+
					'<td>'+ el.loses +'</td>'+
					'<td>'+ el.wins_percent +'</td>'+
					'<td>'+ el.rating +'</td>'+
					'<td>'+ rangs[el.rang] +'</td>'+
				'</tr>'
			});
		
			$('.ratingTable table').html(html);
			$('.newplayer input').val('');
		});
		
		return false;
	});
});