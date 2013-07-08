#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

// https://class.coursera.org/startup-001/forum/thread?thread_id=3186
// https://github.com/danwrong/restler#example-usage
// rest.get(url).on('complete', function(result, response) {
    // Do stuff with 'result', which will contain 
    // the html string returned by .get()
// });


var fs = require('fs');
var rest = require('restler');
// var request = require('request');
var sys = require('util');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://shielded-bastion-6380.herokuapp.com";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1);
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

/*
var cheerioURL = function(url) {
    sys.puts('My url: ' + url);
    rest.get(url).on('complete', function(result) {
    if (result instanceof Error) {
      sys.puts('Error: ' + result.message);
      this.retry(2000);
    } else {
      sys.puts(result);
      return cheerio.load(result);
    }
  });
};
*/

var checkHtmlFile = function(htmlfile, url, checksfile) {
    if (htmlfile) {
//	console.log("Reading from file: %s", htmlfile);
	$ = cheerioHtmlFile(htmlfile);
	var checks = loadChecks(checksfile).sort();
	var out = {};
	for(var ii in checks) {
            var present = $(checks[ii]).length > 0;
            out[checks[ii]] = present;
	}
	var outJson = JSON.stringify(out, null, 4);
	console.log(outJson);
    }
    else 
    {
	if (url) 
	{
//	    console.log("Reading from URL: %s", url);
//	    request(url, function(error, response, body) {
	    rest.get(url).on('complete', function(body) {
//		sys.puts(body);
		var $ = cheerio.load(body);
		var checks = loadChecks(checksfile).sort();
		var out = {};
		for(var ii in checks) {
		    var present = $(checks[ii]).length > 0;
//		    console.log(present);
//		    console.log($(checks[ii]).text());
		    out[checks[ii]] = present;
		}
		var outJson = JSON.stringify(out, null, 4);
		console.log(outJson);
	    }
	  );
	}
	else 
	{
            console.log("Error: either a file or url parameter must be used");
            process.exit(1);
	}
    }
};

if(require.main == module) {
    program
        .option('-c, --checks ', 'Path to checks.json', assertFileExists, CHECKSFILE_DEFAULT)
        .option('-f, --file ', 'Path to index.html', assertFileExists, HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'URL to .html', URL_DEFAULT)
        .parse(process.argv);
//    console.log('URL param: %s', program.url);
    var checkJson = checkHtmlFile(program.file, program.url, program.checks);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
