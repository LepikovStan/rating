var db = require('../db');

module.exports = {
	index: function(req, res){
		var fields = [
				{ name: 'firstname', label: 'Имя', type: 'text' },
				{ name: 'lastname', label: 'Фамилия', type: 'text' },
				{ name: 'city', label: 'Город', type: 'text' },
				{ name: 'tournaments', label: 'Турниров', type: 'text' },
				{ name: 'seasonTournaments', label: 'Турниров сезона', type: 'text' },
				{ name: 'games', label: 'Матчей', type: 'text' },
				{ name: 'wins', label: 'Побед', type: 'text' },
				{ name: 'loses', label: 'Поражений', type: 'text' },
				{ name: 'rating', label: 'Рейтинг', type: 'text' },
				{ name: 'rang', label: 'Ранг', type: 'select', 
					options:  [
						{ name: 'Новичок', val: 0 },
						{ name: 'Любитель', val: 1 },
						{ name: 'Эксперт', val: 2 },
						{ name: 'Мастер', val: 3 },
						{ name: 'Грандмастер', val: 4 }
					]
				},
				{ name: 'activity', label: 'Последний турнир', type: 'text' },
				{ name: 'active', label: 'Активность', type: 'checkbox' }
			],
			rangs = ['Новичок', 'Любитель', 'Эксперт', 'Мастер', 'Грандмастер'];
			
		db.query('select * from players order by rating desc', function(err, rows){
			var place = 0;
		
			for (var i = 0; i < rows.length; i++) {
				
				if (rows[i].active) {
					place = place + 1;
					rows[i].place = place;
				} 
			
				rows[i].firstname = unescape(rows[i].firstname);
				rows[i].lastname = unescape(rows[i].lastname);
				rows[i].city = unescape(rows[i].city);
				rows[i].rang = rangs[rows[i].rang];
			}
			
			res.render('index', { 
				title: 'Express', 
				fields: fields, 
				rows: rows
			});
		});
	},
	newPlayer: function(req, res, next) {
		var winsPercent = Math.round((parseInt(req.body.wins.trim()) / parseInt(req.body.games.trim())) * 100),
			query = 'insert into players (firstname, lastname, city, tournaments, seasonTournaments, games, wins, loses, wins_percent, rating, rang) values (' + 
				'"' + escape(req.body.firstname.trim()) + '", ' +
				'"' + escape(req.body.lastname.trim()) + '", ' +
				'"' + escape(req.body.city.trim()) + '", ' +
				parseInt(req.body.tournaments.trim()) + ', ' +
				(parseInt(req.body.seasonTournaments.trim()) || 0) + ', ' +
				parseInt(req.body.games.trim()) + ', ' +
				parseInt(req.body.wins.trim()) + ', ' +
				parseInt(req.body.loses.trim()) + ', ' +
				winsPercent + ', ' +
				parseInt(req.body.rating.trim()) + ', ' +
				'"' + parseInt(req.body.rang.trim()) + '");',
				rangs = ['Новичок', 'Любитель', 'Эксперт', 'Мастер', 'Грандмастер'];
		
		db.query(query, function(err, rows){
			if (err) {
				throw err;
			} else {
				db.query('select * from players order by rating desc', function(err, rows){
					res.send({
						status: 'ok',
						player: {
							firstname: unescape(req.body.firstname),
							lastname: unescape(req.body.lastname),
							city: req.body.city,
							tournaments: req.body.tournaments,
							seasonTournaments: req.body.seasonTournaments,
							games: req.body.games,
							wins: req.body.wins,
							loses: req.body.loses,
							winsPercent: winsPercent,
							rating: req.body.rating,
							rang: rangs[req.body.rang]
						},
						rows: rows,
					});
				});
			}
		});
	}
};