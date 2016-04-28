//创建子进程的三种方式
var child_process = require('child_process');

/**
 * exec
 */
console.log('-------------------------------exec------------------------------------');
for (var i = 3; i >= 0; i--) {
	var workerprocess = child_process.exec("node worker.js " + i, function(err, stdout, stderr) {
		if (err) {
			console.log(err.stack);
			console.log(err.code);
			console.log(err.signal);
		}
		console.log('stdout:' + stdout);
		console.log('stderr:' + stderr);
	});
	workerprocess.on('exit', function(code) {
		console.log('child process exited widh exit code:' + code);
	})
}
/**
 * spawn
 */
console.log('-------------------------------spawn------------------------------------');
for (var i = 3; i >= 0; i--) {
	var workerprocess = child_process.spawn("node", ["worker.js", i]);

	workerprocess.stdout.on("data", function(data) {
		console.log('stdout:' + data);
	});
	workerprocess.stderr.on("data", function(data) {
		console.log('stderr:' + data);
	});
	workerprocess.on('close', function(code) {
		console.log('child process exited widh exit code:' + code);
	});
	workerprocess.on('exit', function(code) {
		console.log('exit:' + code);
	});
}
/**
 * fork
 */
console.log('-------------------------------fork------------------------------------');
for (var i = 3; i >= 0; i--) {
	var workerprocess = child_process.fork("worker.js", [i]);

	workerprocess.on('close', function(code) {
		console.log('fork child process exited widh exit code:' + code);
	});
}