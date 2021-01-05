var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var multer  = require('multer')
var fs = require('fs')
var storage = require('./storage');
var render = require('./render');
var uploader = require('./upload')
var runscr = require('./pyscr')


var home = require("os").homedir();
var dirs = []
var fls = {}
var std = {}
var crs = {}
var fcs = {}

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'admin',
	database : 'jiithub'
});

var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.get('/', (req, res) => {
	res.writeHead(200, commonHeader);
	res.write(render.hfview("index"));
	res.end();
});

app.post('/auth', function(req, res) {
	var user = req.body.user;
	var pass = req.body.pass;
	var type = req.body.type;
	if (user && pass) {
		if(type == 0){
			connection.query('SELECT * FROM accounts WHERE id = ? AND password = ?', [user, pass], function(error, results, fields) {
			if (results.length > 0) {
				req.session.username = results[0].username;
				req.session.email = results[0].email;
				req.session.batch = results[0].batch;
				req.session.loggedin = true;
				req.session.user = user;
				req.session.type = 0;
				storage.ensureDir(req.session.user);
				connection.query('SELECT id, username FROM faculty', function(err, ops, fi){
					ops.forEach(function(op){
						fcs[op.id] = op.username
					});
					res.redirect('/home');
					res.end();
				});
		} else {
				res.send('Incorrect user and/or pass!');
				res.end();

			}			
		});
		}
		else{
			connection.query('SELECT * FROM faculty WHERE id = ? AND password = ?', [user, pass], function(error, results, fields) {
				if (results.length > 0) {
					req.session.username = results[0].username;
					req.session.loggedin = true;
					req.session.user = user;
					req.session.type = 1;
					connection.query('SELECT * FROM accounts', function(err, ops, fi){
						ops.forEach(function(op){
							std[op.id] = op
						});
						res.redirect('/home');
						res.end();
					});
				} else {
					res.send('Incorrect user and/or pass!');
					res.end();
				}			
				
			});
			
		}
	} else {
		res.send('Please enter user and pass!');
		res.end();
	}
});

var commonHeader = { 'Content-Type': 'html' };
app.get('/home', function(req, res) {
	if (req.session.loggedin) {
		connection.query('SELECT * FROM Courses', function(err, ops, fld) {
			ops.forEach(function(op){
				crs[op.id] = op;
			});
			if(req.session.type == 0){
			connection.query('SELECT * FROM projects WHERE sid = ?', [req.session.user], function(error, results, fields) {
				res.writeHead(200, commonHeader);
				let repo = []
				if (results.length > 0) {
				results.forEach(function(result){
					repo = [...repo, {cid: result.cid, fid: result.fid, name: result.name}]
				});
				}
			render.view("profile", {uname: req.session.username, uid: req.session.user, mail: req.session.email, batch: req.session.batch}, repo, res);
			res.end();
		});
		}
		else{
			connection.query('SELECT * FROM submit WHERE fid = ?', [req.session.user], function(error, results, fields) {
				res.writeHead(200, commonHeader);
				let repo = []
				if (!error && results.length > 0) {
				results.forEach(function(result){
					repo = [...repo, {cid: result.cid, name: result.name, batch: result.batch, date: result.date}]
				});
				}
				else{
					console.log(error)
				}
			render.view("fprofile", {uname: req.session.username, uid: req.session.user}, repo, res);
			res.end();
		});

		}});
	} else {
		res.send('Please login to view this page!');
		res.end();
}
});


app.get('/create', function(req, res){
	if(req.session.type == 0){
		connection.query('SELECT * FROM SUBMIT WHERE BATCH LIKE ?', ['%'+req.session.batch+';%'], function(error, results, fields) {
			res.writeHead(200, commonHeader);
			let repo = []
			if (!error && results.length > 0) {
			results.forEach(function(result){
				if(new Date(result.date) > new Date(Date.now()))
				repo = [...repo, {cid: result.cid, cname: crs[result.cid].name, fid: result.fid, fname: fcs[result.fid], name: result.name}]
			});
			}
			else{
				console.log(error)
			}
		render.view("exrepo", {}, repo, res);
		res.end();
	});
		
	}

	else{
			res.writeHead(200, commonHeader);
			let repo = []
			for(const key in crs){
				repo = [...repo, {cid: crs[key].id, cname: crs[key].name}]
			}
			
		render.view("crtopic", {}, repo, res);
		res.end();
	}
});

app.post('/foo', function(req, res){
	var cid = req.body.cid;
	var name = req.body.name;
	var batch = req.body.batch;
	var desc = req.body.desc;
	var date = req.body.date;
	connection.query('INSERT INTO submit VALUES (?)', [[req.session.user, cid, name, date, batch, desc]], function(error, results, fields) {
		if(error){
			console.log(error);
			res.send("Error")
		}	else{
			res.redirect("/home")
		}
		res.end();
	});
});

app.post('/upload', function(req, res){
	var upload = uploader.uploader(req, 'upload');
	upload(req, res, function (err) {
		if (err) {
				return res.end("Something went wrong:(\n"+err);
		}
		var user = req.session.user;
		var topic = req.body.topic;
		topic = topic.split('~');
		var cid = topic[0];
		var fid = topic[1];
		var name = topic[2];
		var date = new Date(Date.now());
		date = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
		connection.query('INSERT INTO projects VALUES (?)', [[user, cid, fid, name, date]], function(error, results, fields) {
			if(error){
				console.log(error);
			}	else{
				
			}
		});
		//runscr.runPy(home+'/'+user+'/'+cid+'_'+fid+'_'+name, function(err){});
		res.redirect('/home');
		res.end();
	});
});

app.get('/repo', function(req, res){
	
	if (req.session.loggedin){
		let dir = home+'/'+req.session.user+'/'+req.query.name;
		if (!fs.existsSync(dir)){
			res.send('NO such repo!');
			res.end();
		}
		else{
				storage.listFiles(dir, function(resp){
				fls[req.query.name] = resp;
				res.redirect('/view?repo='+req.query.name);
				res.end();
			});
		}	
	}
});

app.get('/view', function(req, res){
	res.writeHead(200, commonHeader);
	let repo = []
	fls[req.query.repo].forEach(function(fl){
		repo = [...repo, {name: fl}]
	});
	var rep = req.query.repo.split('_');
	render.view("repo", {name: rep[2], cid: rep[0], cname: crs[rep[0]].name, fid: rep[1], fname: fcs[rep[1]]}, repo, res);
	res.end();
});

app.get('/topic', function(req, res){
	connection.query('SELECT * FROM projects WHERE fid = ? AND cid = ? AND name = ?', [req.session.user, req.query.cid, req.query.name], function(error, results, fields) {
		res.writeHead(200, commonHeader);
		let repo = []
		if (results.length > 0) {
		results.forEach(function(result){
			
			repo = [...repo, {sid: result.sid, sname: std[result.sid].username, batch: std[result.sid].batch, sdate: result.date}]
			
		});
		}
	render.view("topic", {name: req.query.name, cid: req.query.cid, cname: crs[req.query.cid].name, fid: req.session.user}, repo, res);
	res.end();
	});

	
});

app.post('/commit', function(req, res){
	let dir = home+'/'+req.session.user;
	
	var upload = uploader.uploader(req, 'commit');
	upload(req, res, function (err) {
		if (err) {
				return res.end("Something went wrong:(\n"+err);
		}
		runscr.runPy(home+'/'+req.session.user+'/'+req.body.repo, function(err){
			res.redirect('/repo?name='+req.body.repo);
			res.end();
		});
		
});
});

app.get('/open', function(req, res){
	res.writeHead(200, commonHeader);
	//runscr.openPy(home+'/'+req.session.user+'/'+req.query.repo+'/'+req.query.file, function(data){
	fs.readFile(home+'/'+req.session.user+'/'+req.query.repo+'/'+req.query.file, 'utf8', function(err, data){
		render.viewFile(req.query.file, data, res);
		res.end();
	});
	//});
	
});

app.get('/download', function(req, res){
	let repo = req.query.cid+'_'+req.query.fid+'_'+req.query.name;
	let dir = home+'/'+req.query.sid+'/'+repo;
	
	runscr.zipPy(dir, req.query.sid+'_'+repo, function(err){
		var filename = req.query.sid+'_'+repo+'.zip';
		res.sendFile(dir+'/'+filename, {headers: {"Content-Disposition": 'attachment; filename="'+filename+'"','x-timestamp': Date.now(), 'x-sent': true}}, function (e) {
			if (e) {
				console.log(e)
			} else {
				fs.unlinkSync(dir+'/'+filename);
			}
		});
	});
});

app.get('/plag', function(req, res){
	if(req.session.type == 1){
		res.writeHead(200, commonHeader);
		let repo = []
		for(const key in crs){
			repo = [...repo, {cid: crs[key].id, cname: crs[key].name}]
		}
		render.view('plag', {}, repo, res)
		res.end();
	}
	else
		res.send('Unauthorized')
});

app.post('/pres', function(req, res){
	if(req.session.type == 1){
		storage.ensureDir('PL');
		let chk = home+'/PL/'+req.body.cid;
		fs.open(chk,'r',function(err, fd){
			if (err) {
			connection.query('SELECT * FROM projects WHERE cid = ? ', [req.body.cid], function(error, results, fields) {
				let data = ''
				if (results.length > 0) {
					results.forEach(function(result){
						data += home+'/'+result.sid+'/'+result.cid+'_'+result.fid+'_'+result.name;
						data += '\n';
					});
					
							fs.writeFile(chk, data, function(err) {
									if(err) {
											console.log(err);
									}
									console.log("The file was saved!");
									runscr.plagPy(chk, function(e){
										if(e)	console.log(e);
										else{
											console.log('Report Ready for '+req.body.cid);
											fs.unlinkSync(chk);
											res.redirect('/prep?cid='+req.body.cid);
											res.end();
								
										}
									});
							});
						} 
					});
						
							
						
				
				}else {
					console.log("The file exists!");
				}
				
			});
		
		
	}
	else
		res.send('Unauthorized')
});

app.get('/prep', function(req, res){
	var filename = home+'/PL/'+req.query.cid+'_PL.txt';
	res.sendFile(filename, {headers: {"Content-Disposition": 'attachment; filename="'+filename+'"','x-timestamp': Date.now(), 'x-sent': true}}, function (e) {
		if (e) {
			console.log(e)
		}else {
			fs.unlinkSync(filename);
		}
	});
	
});

app.get('/logout', function(req, res){
	dirs = []
	fls = {}
	req.session.loggedin = false;
	req.session.user = '';
	res.redirect('/');
	res.end();
});

app.listen(8080, () => {
  console.log('Example app listening on port 8080!')
});