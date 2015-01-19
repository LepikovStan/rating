
var select = '<select>'+
		'<option></option>'+
		'<option value="0">0</option>'+
		'<option value="1">1</option>'+
		'<option value="2">2</option>'+
		'<option value="3">3</option>'+
		'<option value="4">4</option>'+
		'<option value="5">5</option>'+
		'<option value="6">6</option>'+
		'<option value="7">7</option>'+
		'</select>',
	MainView = Backbone.View.extend({
		model: new Model(),
		el: '#wrapper',
		tournamentChooseTemplate: '<div class="tournamentInfo">Выберите тип турнира<br /><select name="tournamentInfo"><option></option>'+
									'<% _.each(tournamentInfo, function(tInfo, val) { %> <option value="<%= val %>"><%= tInfo.name %></option> <% }); %>'+
								'</select></div>',
		tournamentFormatTemplate: '<div class="tournamentFormat">Выберите формат соревнований<br /><select name="tournamentFormat" disabled>'+
									'<option></option>'+
									'<option value="single">Одиночки</option>'+
									'<option value="double">Пары</option>'+
								'</select></div><div class="matches"></div>',
		selectPlayerSingleTemplate: '<div class="playerInfo">'+
								'<table><tr><td>Выберите игроков<br/>'+
								'<select name="player1"><option></option>'+
									'<% _.each(el.usersList, function(user) { %> <option value="<%= user.id %>"><%= user.fullname %></option> <% }); %>'+
								'</select><br/>'+
								'<select name="player2"><option></option>'+
									'<% _.each(el.usersList, function(user) { %> <option value="<%= user.id %>"><%= user.fullname %></option> <% }); %>'+
								'</select>'+
								'</td><td>Счёт<br/>'+
									'<div class="pl1">'+ select + select + select + select + select +'</div>'+
									'<div class="pl2">'+ select + select + select + select + select +'</div>'+
								'</td></tr></table>'+
							'</div>',
		selectPlayerDoubleTemplate: '<div class="playerInfo">'+
								'<table><tr><td>Выберите игроков<br/>'+
								'<select name="player1"><option></option>'+
									'<% _.each(el.usersList, function(user) { %> <option value="<%= user.id %>"><%= user.fullname %></option> <% }); %>'+
								'</select>/<br/>'+
								'<select name="player2"><option></option>'+
									'<% _.each(el.usersList, function(user) { %> <option value="<%= user.id %>"><%= user.fullname %></option> <% }); %>'+
								'</select><br/>'+
								'<select name="player3"><option></option>'+
									'<% _.each(el.usersList, function(user) { %> <option value="<%= user.id %>"><%= user.fullname %></option> <% }); %>'+
								'</select>/<br/>'+
								'<select name="player4"><option></option>'+
									'<% _.each(el.usersList, function(user) { %> <option value="<%= user.id %>"><%= user.fullname %></option> <% }); %>'+
								'</select>'+
								'</td><td>Счёт<br/>'+
									'<div class="pl1">'+ select + select + select + select + select +'</div>'+
									'<div class="pl2">'+ select + select + select + select + select +'</div>'+
								'</td></tr></table>',
		ratingTableTemplate: '<table>'+
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
								'<% _.each(usersList, function(user ,num) { %> <tr>'+
									'<td><div><span class="diff"><%= user.oldPosition %> <!--(<%= user.diff %>)--></span></div><%= user.newposition %></td>'+
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
							'</table>',
		initialize: function() {
			this.template = _.template(
				this.colTemplate([
					{
						col: 'l',
						html: this.tournamentChooseTemplate + this.tournamentFormatTemplate
					},
					{
						col: 'r',
						html: '<div class="ratingTable">' + this.ratingTableTemplate + '</div>'
					}
				])
			);
		
			this.model.on('change', _.bind(function() {
				var chAttrs = this.model.changedAttributes();
			
				if (chAttrs.users) {
					this.render();
				}
			}, this));
			
			this.model.fill();
			usersList = this.model.get('usersList');
		},
		colTemplate: function(options) {
			var html = '<div class="matchResults"></div><div class="cols">';
					
				_.each(options, function(el) {
					html += '<div class="'+el.col+'-col">'+el.html+'</div>';
				});
					
				html += '</div>';
				
			return html;
		},
		events: {
			'change select[name="tournamentInfo"]': 'chooseTournamentInfo',
			'change select[name="tournamentFormat"]': 'chooseTournamentFormat',
			'change select[name="player1"], select[name="player2"]': 'changePlayer',
			'click button': 'send'
		},
		renderGames: function() {
			var html = '';
			
			_.each(this.model.get('games'), function(game, num) {
				var scores = '';

				if (game.format === 'single') {
					_.each(game.winner.score, function (score, i) {
						scores += '<div>' + game.winner.score[i] + ':' + game.loser.score[i] + '</div>';
					});

					html += '<table class="match"><tr><td>' + game.winner.fullname + '</td><td>' + scores + '</td><td>' + game.loser.fullname + '</td></tr></table>';
				}
				console.log('game', game)
			});
		
			this.$('.matchResults').html(html);
		},
		getDoubleRating: function(rating1, rating2) {
			if (rating1 > rating2) {
				return Math.round((2*rating1 + rating2)/3);
			} else {
				return Math.round((2*rating2 + rating1)/3);
			}
		},
		send: function(e) {
			var $this = $(e.target),
				score1 = [],
				score2 = [],
				win1 = 0,
				win2 = 0,
				player1 = this.model.get('users')[$('select[name="player1"]').val()],
				player2 = this.model.get('users')[$('select[name="player2"]').val()],
				player3 = this.model.get('users')[$('select[name="player3"]').val()],
				player4 = this.model.get('users')[$('select[name="player4"]').val()],
				tournamentInfo = this.model.get('tournamentInfo'),
				T = tournamentInfo[$('select[name="tournamentInfo"]').val()].coeff,
				D = 1,
				winner,
				loser,
				K;
			
			if (player3 && player4) {
				this.sendDouble();
			} else {
				this.sendSingle();
			}
			
			/*_.each(score1, function(el, i) {
				if (score1[i] > score2[i]) {
					win1 += 1;
				}
				
				if (score2[i] > score1[i]) {
					win2 += 1;
				}
			});
			
			if (win1 > win2) {
				D = 1;
				K = win1 - win2;
				winner = player1;
				loser = player2;
				winnerscore = score1;
				loserscore = score2;
			} else {
				D = 1;
				K = win2 - win1;
				winner = player2;
				loser = player1;
				winnerscore = score2;
				loserscore = score1;
			}
			
			winnerdiff = this.newRating(
				1, 
				1, 
				T, 
				this.model.get('K')[K],
				winner.rating,
				loser.rating
			);
			loserdiff = this.newRating(
				-1, 
				1, 
				T, 
				this.model.get('K')[K],
				winner.rating,
				loser.rating
			);
					
			
			if (player3 && player4) {
				console.log('winner: ' + winner.fullname + ', new rating: ' + 
					(parseInt(winner.rating) + winnerdiff) + ', diff: ' + winnerdiff
				);
				console.log('loser: ' + loser.fullname + ', new rating: ' + 
					(parseInt(loser.rating) + loserdiff) + ', diff: ' + loserdiff
				);
			} else {
				console.log('winner: ' + winner.fullname + ', new rating: ' + 
					(parseInt(winner.rating) + winnerdiff) + ', diff: ' + winnerdiff
				);
				console.log('loser: ' + loser.fullname + ', new rating: ' + 
					(parseInt(loser.rating) + loserdiff) + ', diff: ' + loserdiff
				);
			}
			
			winner.rating = parseInt(winner.rating) + winnerdiff;
			loser.rating = parseInt(loser.rating) + loserdiff;
			
			winner.diff += winnerdiff;
			loser.diff += loserdiff;
			
			this.model.setGame({
				winner: {
					fullname: winner.fullname,
					score: _.compact(winnerscore)
				},
				loser: {
					fullname: loser.fullname,
					score: _.compact(loserscore)
				}
			});
			
			this.renderTable();
			this.renderGames();*/
		},
		sendDouble: function() {
			var score1 = [],
				score2 = [],
				win1 = 0,
				win2 = 0,
				player1 = this.model.get('users')[$('select[name="player1"]').val()],
				player2 = this.model.get('users')[$('select[name="player2"]').val()],
				player3 = this.model.get('users')[$('select[name="player3"]').val()],
				player4 = this.model.get('users')[$('select[name="player4"]').val()],
				tournamentInfo = this.model.get('tournamentInfo'),
				T = tournamentInfo[$('select[name="tournamentInfo"]').val()].coeff,
				D = 1,
				winnerRating,
				loserRating,
				winnerscore,
				loserscore,
				K;

			console.log('double1: ' + player1.fullname + '/' + player2.fullname + ', rating: ' + this.getDoubleRating(parseInt(player1.rating), parseInt(player2.rating)));
			console.log('double2: ' + player3.fullname + '/' + player4.fullname + ', rating: ' + this.getDoubleRating(parseInt(player3.rating), parseInt(player4.rating)));

			$('select').each(function(i, el) {
				if ($(this).closest('.pl1').length) {
					score1.push($(this).val());
				}
				if ($(this).closest('.pl2').length) {
					score2.push($(this).val());
				}
			});

			_.each(score1, function(el, i) {
				if (score1[i] > score2[i]) {
					win1 += 1;
				}

				if (score2[i] > score1[i]) {
					win2 += 1;
				}
			});

			if (win1 > win2) {
				K = win1 - win2;
				winnerscore = score1;
				loserscore = score2;
				winnerRating = this.getDoubleRating(parseInt(player1.rating), parseInt(player2.rating));
				loserRating = this.getDoubleRating(parseInt(player3.rating), parseInt(player4.rating));
			} else {
				K = win2 - win1;
				winnerscore = score2;
				loserscore = score1;
				winnerRating = this.getDoubleRating(parseInt(player3.rating), parseInt(player4.rating));
				loserRating = this.getDoubleRating(parseInt(player1.rating), parseInt(player2.rating));
			}

			var winnerdiff = this.newRating(
				1,
				1,
				T,
				this.model.get('K')[K],
				winnerRating,
				loserRating
			);
			var loserdiff = this.newRating(
				-1,
				1,
				T,
				this.model.get('K')[K],
				winnerRating,
				loserRating
			);

			if (win1 > win2) {
				console.log('winner: ' + player1.fullname + ', new rating: ' +
					(parseInt(player1.rating) + winnerdiff) + ', diff: ' + winnerdiff
				);
				console.log('winner: ' + player2.fullname + ', new rating: ' +
					(parseInt(player2.rating) + winnerdiff) + ', diff: ' + winnerdiff
				);
				console.log('loser: ' + player3.fullname + ', new rating: ' +
					(parseInt(player3.rating) + loserdiff) + ', diff: ' + loserdiff
				);
				console.log('loser: ' + player4.fullname + ', new rating: ' +
					(parseInt(player4.rating) + loserdiff) + ', diff: ' + loserdiff
				);


				player1.rating = parseInt(player1.rating) + winnerdiff;
				player2.rating = parseInt(player2.rating) + winnerdiff;
				player3.rating = parseInt(player3.rating) + loserdiff;
				player4.rating = parseInt(player4.rating) + loserdiff;

				player1.diff += winnerdiff;
				player2.diff += winnerdiff;
				player3.diff += loserdiff;
				player4.diff += loserdiff;
			} else {
				console.log('winner: ' + player3.fullname + ', new rating: ' +
					(parseInt(player3.rating) + winnerdiff) + ', diff: ' + winnerdiff
				);
				console.log('winner: ' + player4.fullname + ', new rating: ' +
					(parseInt(player4.rating) + winnerdiff) + ', diff: ' + winnerdiff
				);
				console.log('loser: ' + player1.fullname + ', new rating: ' +
					(parseInt(player1.rating) + loserdiff) + ', diff: ' + loserdiff
				);
				console.log('loser: ' + player2.fullname + ', new rating: ' +
					(parseInt(player2.rating) + loserdiff) + ', diff: ' + loserdiff
				);

				player3.rating = parseInt(player3.rating) + winnerdiff;
				player4.rating = parseInt(player4.rating) + winnerdiff;
				player1.rating = parseInt(player1.rating) + loserdiff;
				player2.rating = parseInt(player2.rating) + loserdiff;

				player3.diff += winnerdiff;
				player4.diff += winnerdiff;
				player1.diff += loserdiff;
				player2.diff += loserdiff;
			}


			this.renderTable();
		},
		sendSingle: function() {
			var score1 = [],
				score2 = [],
				win1 = 0,
				win2 = 0,
				player1 = this.model.get('users')[$('select[name="player1"]').val()],
				player2 = this.model.get('users')[$('select[name="player2"]').val()],
				tournamentInfo = this.model.get('tournamentInfo'),
				T = tournamentInfo[$('select[name="tournamentInfo"]').val()].coeff,
				D = 1,
				winner,
				loser,
				winnerscore,
				loserscore,
				K;

			console.log('player1: ' + player1.fullname + ', rating: ' + player1.rating);
			console.log('player2: ' + player2.fullname + ', rating: ' + player2.rating);

			$('select').each(function(i, el) {
				if ($(this).closest('.pl1').length) {
					score1.push($(this).val());
				}
				if ($(this).closest('.pl2').length) {
					score2.push($(this).val());
				}
			});

			_.each(score1, function(el, i) {
				if (score1[i] > score2[i]) {
					win1 += 1;
				}

				if (score2[i] > score1[i]) {
					win2 += 1;
				}
			});

			if (win1 > win2) {
				K = win1 - win2;
				winner = player1;
				loser = player2;
				winnerscore = score1;
				loserscore = score2;
			} else {
				K = win2 - win1;
				winner = player2;
				loser = player1;
				winnerscore = score2;
				loserscore = score1;
			}

			var winnerdiff = this.newRating(
				1,
				1,
				T,
				this.model.get('K')[K],
				winner.rating,
				loser.rating
			);
			var loserdiff = this.newRating(
				-1,
				1,
				T,
				this.model.get('K')[K],
				winner.rating,
				loser.rating
			);
			console.log('model K', this.model.get('K')[2], K)

			winner.rating = parseInt(winner.rating) + winnerdiff;
			loser.rating = parseInt(loser.rating) + loserdiff;

			winner.diff += winnerdiff;
			loser.diff += loserdiff;

			this.model.setGame({
				format: 'single',
				winner: {
					fullname: winner.fullname,
					score: _.compact(winnerscore)
				},
				loser: {
					fullname: loser.fullname,
					score: _.compact(loserscore)
				}
			});

			console.log('winner: ' + winner.fullname + ', new rating: ' +
				(parseInt(winner.rating) + winnerdiff) + ', diff: ' + winnerdiff
			);
			console.log('loser: ' + loser.fullname + ', new rating: ' +
				(parseInt(loser.rating) + loserdiff) + ', diff: ' + loserdiff
			);

			this.renderTable();
			this.renderGames();
		},
		renderTable: function() {
			usersList.sort(function(a, b) {
				return b.rating - a.rating;
			});
			
			$.each(usersList, function(i, user) {
				var diff = user.position - (i+1);
			
				if (diff !== 0) {
					user.oldPosition = diff;
				} else {
					diff = '';
				}
				
				user.newposition = i+1;
			});
		
			this.$('.ratingTable').html(_.template(this.ratingTableTemplate)(this.model.attributes));
		},
		newRating: function(W, D, T, K, winnerRating, loserRating) {
			//console.log('!!!!! newRating !!!!!!', loserRating, winnerRating);
			//console.log('WDTK', W, D, T, K, W*D*T*K);
			//console.log('RL - RW', loserRating - winnerRating);
			//console.log('RL - RW/400', (loserRating - winnerRating)/400);
			//console.log('pow RL - RW/400', Math.pow(10, (loserRating - winnerRating)/400));
			//console.log('1 - 1/10 (RL - RW/400) + 1', 1 - (1/(Math.pow(10, (loserRating - winnerRating)/400) + 1)));
			
			return Math.round(W*D*T*K * (1 - (1/(Math.pow(10, (loserRating - winnerRating)/400) + 1))));
		},
		changePlayer: function(e) {
			var $this = $(e.target),
				name = $this.attr('name'),
				val = $this.val();
			
			if (name === 'player1') {
				$('select[name="player2"] option[disabled]').removeAttr('disabled');
				$('select[name="player3"] option[disabled]').removeAttr('disabled');
				$('select[name="player4"] option[disabled]').removeAttr('disabled');
				
				$('select[name="player2"] option[value="'+val+'"]').attr('disabled', 'disabled');
				$('select[name="player3"] option[value="'+val+'"]').attr('disabled', 'disabled');
				$('select[name="player4"] option[value="'+val+'"]').attr('disabled', 'disabled');
			}
			
			if (name === 'player2') {
				$('select[name="player1"] option[disabled]').removeAttr('disabled');
				$('select[name="player3"] option[disabled]').removeAttr('disabled');
				$('select[name="player4"] option[disabled]').removeAttr('disabled');
				
				$('select[name="player1"] option[value="'+val+'"]').attr('disabled', 'disabled');
				$('select[name="player3"] option[value="'+val+'"]').attr('disabled', 'disabled');
				$('select[name="player4"] option[value="'+val+'"]').attr('disabled', 'disabled');
			}
			
			if (name === 'player3') {
				$('select[name="player1"] option[disabled]').removeAttr('disabled');
				$('select[name="player2"] option[disabled]').removeAttr('disabled');
				$('select[name="player4"] option[disabled]').removeAttr('disabled');
				
				$('select[name="player1"] option[value="'+val+'"]').attr('disabled', 'disabled');
				$('select[name="player2"] option[value="'+val+'"]').attr('disabled', 'disabled');
				$('select[name="player4"] option[value="'+val+'"]').attr('disabled', 'disabled');
			}
			
			if (name === 'player4') {
				$('select[name="player1"] option[disabled]').removeAttr('disabled');
				$('select[name="player2"] option[disabled]').removeAttr('disabled');
				$('select[name="player3"] option[disabled]').removeAttr('disabled');
				
				$('select[name="player1"] option[value="'+val+'"]').attr('disabled', 'disabled');
				$('select[name="player2"] option[value="'+val+'"]').attr('disabled', 'disabled');
				$('select[name="player3"] option[value="'+val+'"]').attr('disabled', 'disabled');
			}
		},
		chooseTournamentInfo: function(e) {
			var $this = this.$(e.target);
			
			this.tournamentFormatSelect.removeAttr('disabled');
		},
		chooseTournamentFormat: function(e) {
			var val = $(e.target).val();
		
			this.model.set('tournamentFormat', val);
			
			if (val === 'single') {
				this.renderMatchesForm();
			}
			
			if (val === 'double') {
				this.renderMatchesForm(true);
			}
		},
		render: function() {
			this.$el.html(this.template(this.model.attributes));
			
			this.setElements();
		},
		renderMatchesForm: function(doubles) {
			var selectOptions = '';
			
			if (doubles) {
				this.matches.html(_.template(this.selectPlayerDoubleTemplate)({ el: { usersList: this.model.get('usersList') } }) + '<button>send</button>');
			} else {
				this.matches.html(_.template(this.selectPlayerSingleTemplate)({ el: { usersList: this.model.get('usersList') } }) + '<button>send</button>');
			}
		},
		setElements: function() {
			this.tournamentFormatSelect = this.$('select[name="tournamentFormat"]');
			this.matches = this.$('.matches');
		}
	});
	
$(function() {
	new MainView();
});