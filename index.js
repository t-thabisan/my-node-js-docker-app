const express = require('express')
const mysql = require('mysql2');

const mysqlConfig = {
    host: "mysql_server",
    user: "thabisan",
    password: "pswd",
    database: "tabi_db"
}

var con = null
const app = express()
const id = 1;

var cpt = null
var resultToReturn = ""

function setResultToDisplay(cptValue) {
	cpt = cptValue;
	resultToReturn = "Hello to my nodeJS app, I have been seen " + cptValue + " times.";
	console.log(cptValue);
}

app.get('/', function(req, res) {
    // CREATE MYSQL CONNECTION
    if(con==null) {
		con = mysql.createConnection(mysqlConfig);
		con.connect(function(err) {
			if (err) throw err;
			console.log('connected');
		});
	}

	// CREATE TABLE IF NOT EXISTS
	con.connect(function(err) {
		if (err) throw err;
		const sql = `
		CREATE TABLE IF NOT EXISTS cpt (
		  id INT PRIMARY KEY,
		  cpt INT NOT NULL
		)  ENGINE=INNODB;
	  `;
		con.query(sql, function(err, result) {
			if (err) throw err;
		});
	});
	
	// HANDLE CPT
    con.connect(function(err) {
        if (err) throw err;
		
		// SELECT
        const sql = `SELECT cpt FROM cpt WHERE id=${id}`
        con.query(sql, function(err, result, fields) {
            if (err) throw err;
			
            if (result == null || result == "") {
				// NO CPT IN DB -> CREATE OUR CPT IN DB
                const sql = `INSERT INTO cpt (id, cpt) VALUES (${id}, ${cpt})`
                con.query(sql, function(err, result) {
                    if (err) throw err;
					setResultToDisplay(result);
                });
            } else {
				// GET CPT FOR DISPLAY
				setResultToDisplay(result);
				
				// INCR CPT FOR UPDATE IN DB
				cpt++;
				const sql = `UPDATE cpt SET cpt=${cpt} WHERE id=${id}`
                con.query(sql, function(err, result) {
                    if (err) throw err;
                });
            }
        });
    });

    // RETURN
    res.send(resultToReturn);
})

app.listen(3000)
console.log("listening on port 3000")