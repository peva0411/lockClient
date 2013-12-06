var cp = require('child_process');
var MongoClient = require('mongodb').MongoClient;
var nconf = require('nconf');
var uuid = require("node-uuid");

nconf.file('settings.json').env();
var connectionString = nconf.get('connectionString');

var guid = uuid.v1();
var token = guid.substring(8,4);
console.log("Token : " + token);

var onlock = function(db){
		cp.exec('c:\\windows\\system32\\rundll32.exe user32.dll,LockWorkStation', function(err, stdout, stderr){
			if (err){
				console.log(err);
			}
			console.log("Locked it up");
			console.log(stderr);

			//set key back to unlock
			var desktops = db.collection("desktops");
			desktops.update({"key": token}, {"key": token, "isLocked": false}, {"multi":false}, function(err, data){
				if (err) console.log(err);


				console.log("Set status = unlocked");
			});
		});
	};

MongoClient.connect(connectionString, function(err, db){
	if (err) return;
	var desktops = db.collection("desktops");

	//add key locked to db 
	desktops.insert({"key":token, "isLocked":false}, function(err, datat){
		if (err) {
			console.log(err);
			return;
		}
		setInterval(function(){
		desktops.findOne({"key": token}, function(err, data){
					if (err) return;
					if (data && data.isLocked){
						//console.log('Locked it up')
						onlock(db);
					}
				});
		}, 1000);
	});
});

