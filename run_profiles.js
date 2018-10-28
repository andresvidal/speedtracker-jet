// npm install node-fetch --save
var fetch = require('node-fetch');
var fs = require('fs');
 
let api_path = 'https://api.speedtracker.org/v1/test/'
let path = "_profiles"

let username = process.env.ST_GITHUB_USERNAME || 'username'
let repo = process.env.ST_GITHUB_REPOSITORY || 'repository'
let branch = process.env.ST_GITHUB_BRANCH || 'master';
let key = process.env.ST_ENCRYPTION_KEY || ''

if (username=='username' || repo=='repository'){
    console.log("Set the following env variables first:");
    console.log(` export ST_GITHUB_USERNAME=${username}`);
    console.log(` export ST_GITHUB_REPOSITORY=${repo}`);
    console.log(` export ST_GITHUB_BRANCH=${branch}`);
    console.log(` export ST_ENCRYPTION_KEY=${key}`);
    console.log("Usage: node run_profiles.js");
    process.exit(-1);
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

fs.readdir(path, function(err, items) {
    const start = async () => {
        await asyncForEach(items, async (item) => {
            if (item.endsWith('.html')){
                profile_slug = item.replace('.html','')
                url = `${api_path}${username}/${repo}/${branch}/${profile_slug}?key=${key}`;
                
                await console.log(`Running ${url}`)

                await fetch(url)
                    .then(r=>r.json())
                    .then(json=>console.log(json));
            };
        });
    }
    start();
});
