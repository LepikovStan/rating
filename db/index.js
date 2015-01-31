var mysql = require('mysql'),
	connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '123'
	});
	
	connection.query("SET NAMES 'utf8'");
	connection.query('use rating');

module.exports = connection;