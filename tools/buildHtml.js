import fs from 'fs';

fs.readFile('index.html', 'utf8', (err, markup) => {
  if (err) {
    return console.log(err);
  }

  let dir = 'dist';
  
  if (!fs.existsSync(dir)){
	  fs.mkdirSync(dir);
  }
  fs.writeFile(dir + '/index.html', markup, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
  });
});