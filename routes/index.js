var db = require('../db');

module.exports = {
	index: function(req, res){
		var fields = [
				{ name: 'firstname', label: 'Имя' },
				{ name: 'lastname', label: 'Фамилия' },
				{ name: 'city', label: 'Город' },
				{ name: 'tournaments', label: 'Турниров' },
				{ name: 'seasonTournaments', label: 'Турниров сезона' },
				{ name: 'games', label: 'Матчей' },
				{ name: 'wins', label: 'Побед' },
				{ name: 'loses', label: 'Поражений' },
				{ name: 'rating', label: 'Рейтинг' },
				{ name: 'rang', label: 'Ранг' },
				{ name: 'activity', label: 'Активность' }
			];
			
		db.query('select * from players', function(err, rows){
			for (var i = 0; i < rows.length; i++) {
				rows[i].firstname = unescape(rows[i].firstname);
				rows[i].lastname = unescape(rows[i].lastname);
				rows[i].rang = unescape(rows[i].rang);
				rows[i].city = unescape(rows[i].city);
			}
			
			rows.sort(function(a, b) {
				return a.rating < b.rating
			});
			
			res.render('index', { title: 'Express', fields: fields, rows: rows })
		});
	
		
	},
	newPlayer: function(req, res, next) {
		var winsPercent = Math.round((parseInt(req.body.wins) / parseInt(req.body.games)) * 100),
			query = 'insert into players (firstname, lastname, city, tournaments, seasonTournaments, games, wins, loses, wins_percent, rating, rang) values (' + 
				'"' + escape(req.body.firstname) + '", ' +
				'"' + escape(req.body.lastname) + '", ' +
				'"' + escape(req.body.city) + '", ' +
				parseInt(req.body.tournaments) + ', ' +
				parseInt(req.body.seasonTournaments) + ', ' +
				parseInt(req.body.games) + ', ' +
				parseInt(req.body.wins) + ', ' +
				parseInt(req.body.loses) + ', ' +
				winsPercent + ', ' +
				parseInt(req.body.rating) + ', ' +
				'"' + escape(req.body.rang) + '");';
		
		db.query(query, function(err, rows){
			if (err) {
				throw err;
			} else {
				db.query('select * from players', function(err, rows){
					res.send({
						status: 'ok',
						player: {
							firstname: req.body.firstname,
							lastname: req.body.lastname,
							city: req.body.city,
							tournaments: req.body.tournaments,
							seasonTournaments: req.body.seasonTournaments,
							games: req.body.games,
							wins: req.body.wins,
							loses: req.body.loses,
							winsPercent: winsPercent,
							rating: req.body.rating,
							rang: req.body.rang
						},
						rows: rows,
					});
				});
			}
		});
	}
};