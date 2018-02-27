var fs = require("fs");
var path = require("path");
console.log('unlinking izifix-icon');

var buildGradlePath = path.join("android", "app", "build.gradle");

if (!fs.existsSync(buildGradlePath)) {
    console.error(`Couldn't find build.gradle file. You might need to update it manually. Please refer to plugin installation section for Android at izifix-icon`);
    return;
}

// 2. Add the codepush.gradle build task definitions
var buildGradleContents = fs.readFileSync(buildGradlePath, "utf8");
var izifixGradleLink = `apply from: "../../node_modules/izifix-icon/fonts.gradle"`;
if (~buildGradleContents.indexOf(izifixGradleLink)) {
    
    buildGradleContents = buildGradleContents.replace(izifixGradleLink, "");
    fs.writeFileSync(buildGradlePath, buildGradleContents);
}