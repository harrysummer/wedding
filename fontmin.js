const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const mkdirp = require('mkdirp');
const mongoose = require('mongoose');
const Attendee = require('./server/models/attendee');
mongoose.connect('mongodb://localhost:27017/wedding');

function subset(input, text, outputPath, fmt) {
    if (!fs.existsSync(outputPath)) {
        mkdirp.sync(outputPath);
    }
    let output = path.join(outputPath, path.basename(input, path.extname(input)) + '.' + fmt);
    let cmd = 'pyftsubset';
    let args = [
        input,
        `--text='${text}'`,
        `--output-file=${output}`
    ];
    if (fmt === 'woff') {
        args.push('--flavor=woff');
        args.push('--with-zopfli');
    } else if (fmt === 'woff2') {
        args.push('--flavor=woff2');
        args.push('--with-zopfli');
    }
    let process = cp.spawn(cmd, args, {cwd: __dirname});
    process.stdout.on('data', (data)=>console.log(data.toString('utf8')));
    process.stderr.on('data', (data)=>console.error(data.toString('utf8')));
    process.on('exit', (code)=> {
        if (code == 0)
            console.log(`${output} font created successfully`);
        else
            console.error(`${output} font creation failed`);
    });
    return process;
}

function makeFont(text, fontName, outputPath) {
    const inputFile = `${__dirname}/invitation/${fontName}`;
    const ext = path.extname(fontName);
    const baseName = path.basename(fontName, ext);
    if (ext === '.otf' || ext === '.OTF') {
        subset(inputFile, text, outputPath, 'otf')
            .on('exit', (code) => {
                if (code == 0) {
                    const input = path.join(outputPath, baseName + '.otf');
                    const output = path.join(outputPath, baseName + '.ttf');
                    let process = cp.spawn('fontforge', [
                        '-lang=ff',
                        '-c', 'Open($1);CIDFlatten();Generate($2);Quit(0);',
                        input,
                        output
                    ], {cwd: __dirname});
                    process.stdout.on('data', (data)=>console.log(data.toString('utf8')));
                    process.stderr.on('data', (data)=>console.error(data.toString('utf8')));
                    process.on('exit', (code)=> {
                        if (code == 0)
                            console.log(`${output} created successfully`);
                        else
                            console.error(`${output} creation failed`);
                    });
                }
            });
    } else {
        subset(inputFile, text, outputPath, 'ttf')
    }
    subset(inputFile, text, outputPath, 'woff');
    subset(inputFile, text, outputPath, 'woff2');
}

var nameTexts = '先生女士丁酉闰六初五夏睿张萌清龙洪玉霞谢炳纪安徽省巢湖市银屏路喜庆运升楼一中午新郎娘结婚典礼:（）20178　 ';
Attendee.find({})
  .select('name dependant')
  .exec((err, attendee) => {
    if (err)
      console.error(err);
    for (var i = 0; i < attendee.length; i++) {
      var person = attendee[i];
      var name = person.name;
      var dep = person.dependant;
      for (var j = 0; j < name.length; j++) {
        if (!nameTexts.includes(name[j]))
          nameTexts += name[j];
      }
      if (typeof dep === 'string') {
        for (var j = 0; j < dep.length; j++) {
          if (!nameTexts.includes(dep[j]))
            nameTexts += dep[j];
        }
      }
    }
    makeFont(nameTexts, 'FZKTK.TTF', __dirname + '/dist/static/fonts');
    mongoose.disconnect();
  });
var staticTexts = "送呈台启谨定于公历农年月日星期为举行恭请光临席设时间邀人：";
makeFont(staticTexts, 'SourceHanSerifSC-SemiBold.otf', __dirname + '/dist/static/fonts');
