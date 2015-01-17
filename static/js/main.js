/*var
	options = '',
	W,
	D=1,
	T=1,
	K=32,
	html = '<table>';
	
	html += ;
	
	$.each(users, function(i, user) {
		user.id = i+1;
		usersObj[user.id] = user;
		options += '<option value="'+user.id+'">'+user.fullname+'</option>';
		
		html += '<tr>'+
				'<td>'+user.position+'</td>'+
				'<td>'+user.fullname+'</td>'+
				'<td>'+user.city+'</td>'+
				'<td>'+user.tournaments+'</td>'+
				'<td>'+user.currentSeason+'</td>'+
				'<td>'+user.games+'</td>'+
				'<td>'+user.wins+'</td>'+
				'<td>'+user.loses+'</td>'+
				'<td>'+user.winsProcent+'</td>'+
				'<td>'+user.rating+'</td>'+
				'<td>'+user.rang+'</td>'+
			'</tr>';
	});
	
	html += '</table>';
	
	$('.wrapper').html(html);
	
	$('form').html(
		'<select name="player1">'+options+'</select>' + 
		'<input type="text" value="" name="score1"> : <input type="text" value="" name="score2">' +
		'<select name="player2">'+options+'</select>'+
		'<div><input type="submit" value="send" /></div>'
	);
	*/
var MainView = Backbone.View.extend({
		model: new Model(),
		el: '#wrapper',
		tournamentChooseTemplate: '<div class="tournamentInfo">Выберите тип турнира<br /><select name="tournamentInfo"><option></option>'+
									'<% _.each(tournamentsInfo, function(tInfo, val) { %> <option value="<%= val %>"><%= tInfo.name %></option> <% }); %>'+
								'</select></div>',
		tournamentFormatTemplate: '<div class="tournamentFormat">Выберите фрмат соревнований<br /><select name="tournamentFormat" disabled>'+
									'<option></option>'+
									'<option value="single">Одиночки</option>'+
									'<option value="double">Пары</option>'+
								'</select></div>',
		/*selectPlayerTemplate: '<div class="playerInfo">Выберите игрока<br /><select><option></option>'+
								'<% _.each(tournamentsInfo, function(tInfo, val) { %> <option value="<%= val %>"><%= tInfo.name %></option> <% }); %>'+
							'</select></div>',*/
		ratingTableTemplate: '<div class="ratingTable"><table>'+
								'<tr>'+
									'<th>№</th>'+
									'<th>Имя</th>'+
									'<th>Город</th>'+
									'<th>Кол-во турниров</th>'+
									'<th>Кол-во турниров в сезоне</th>'+
									'<th>Кол-во игр</th>'+
									'<th>Побед</th>'+
									'<th>Поражений</th>'+
									'<th>% побед</th>'+
									'<th>Рейтинг</th>'+
									'<th>Ранг</th>'+
								'</tr>'+
								'<% _.each(usersList, function(user) { %> <tr>'+
									'<td><%= user.position %></td>'+
									'<td><%= user.fullname %></td>'+
									'<td><%= user.city %></td>'+
									'<td><%= user.tournaments %></td>'+
									'<td><%= user.currentSeason %></td>'+
									'<td><%= user.games %></td>'+
									'<td><%= user.wins %></td>'+
									'<td><%= user.loses %></td>'+
									'<td><%= user.winsProcent %></td>'+
									'<td><%= user.rating %></td>'+
									'<td><%= user.rang %></td>'+
								'</tr> <% }); %>'+
							'</table></div>',
		initialize: function() {
			this.template = _.template(
				this.colTemplate([
					{
						col: 'l',
						html: this.tournamentChooseTemplate + this.tournamentFormatTemplate
					},
					{
						col: 'r',
						html: this.ratingTableTemplate
					}
				])
			);
		
			this.model.on('change', _.bind(function() {
				this.render();
			}, this));
			
			this.model.fill();
		},
		colTemplate: function(options) {
			var html = '<div class="cols">';
					
				_.each(options, function(el) {
					html += '<div class="'+el.col+'-col">'+el.html+'</div>';
				});
					
				html += '</div>';
				
			return html;
		},
		events: {
			'change select[name="tournamentInfo"]': 'chooseTournamentInfo'
		},
		chooseTournamentInfo: function(e) {
			console.log('chooseTournamentInfo', e, this)
		},
		render: function() {
			this.$el.html(this.template(this.model.attributes));
		}
	});
	
$(function() {
	new MainView();
});