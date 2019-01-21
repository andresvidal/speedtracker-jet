// npm install node-fetch --save
var fetch = require('node-fetch');
var fs = require('fs');
 
let api_default = 'https://api.speedtracker.org/v1/test/'

let path = "_profiles"
let cmd_profile_slugs = process.argv.slice(2)

let username = process.env.ST_GITHUB_USERNAME || 'username'
let repo = process.env.ST_GITHUB_REPOSITORY || 'repository'
let branch = process.env.ST_GITHUB_BRANCH || 'master';
let key = process.env.ST_ENCRYPTION_KEY || ''
let api_url = process.env.ST_API_URL || api_default

if (username=='username' || repo=='repository'){
    console.log("Set the following env variables first:");
    console.log(` export ST_GITHUB_USERNAME=${username}`);
    console.log(` export ST_GITHUB_REPOSITORY=${repo}`);
    console.log(` export ST_GITHUB_BRANCH=${branch}`);
    console.log(` export ST_ENCRYPTION_KEY=${key}`);
    console.log(` export ST_API_URL=${api_url}`);
    console.log("Usage: node run_profiles.js");
    process.exit(-1);
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

async function run_profile(profile_slug){
    url = `${api_url}${username}/${repo}/${branch}/${profile_slug}?key=${key}`;
    await console.log(`Running ${url}`)
    await fetch(url)
            .then(r=>r.json())
            .then(json=>console.log(json));
}

fs.readdir(path, function(err, items) {
    const start = async () => {
        await asyncForEach(items, async (item) => {
            if (item.endsWith('.html')){
                profile_slug = item.replace('.html','')
                if (cmd_profile_slugs.length < 1){
                    await run_profile(profile_slug)
                } else if (cmd_profile_slugs.indexOf(profile_slug) > -1) {
                    await run_profile(profile_slug)
                }
            }
        });
    }
    start();
});
