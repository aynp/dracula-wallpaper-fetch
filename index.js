const { writeFile } = require('fs');
const path = require('path');

const URL = 'https://api.github.com/repos/aynp/dracula-wallpapers/contents/';

let final = [];

const processFolder = async function (folderName, folderURL) {
  try {
    let tmp = {};
    tmp.name = folderName;
    tmp.walls = [];

    const infolder = await fetch(folderURL);
    const folderdata = await infolder.json();

    folderdata.forEach((item) => {
      if (item.type === 'file') {
        tmp.walls.push({
          name: path.parse(item.name).name,
          urlhd: item.download_url,
          url4k:
            path.parse(item.download_url).dir +
            '/4k/' +
            path.parse(item.download_url).base,
        });
      }
    });
    return tmp;
  } catch (error) {
    console.log(error);
  }
};

const main = (async function () {
  try {
    const res = await fetch(URL);
    const data = await res.json();

    for (const item of data) {
      if (item.type === 'dir') {
        const folderData = await processFolder(item.name, item.url);
        final.push(folderData);
      }
    }
    console.dir(final, { depth: null });
    writeFile('walls.json', JSON.stringify(final), (err) => {});
  } catch (error) {
    console.log('😭');
    console.log(error);
  }
})();
