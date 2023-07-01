const { firefox } = require("playwright");
const express = require("express");
const app = express();
const m3u8Parser = require("m3u8-parser");
const PORT = process.env.PORT || 5555;
const headless = process.env.headless || true;
const fetch = require("node-fetch");
const axios = require("axios");
const FormData = require("form-data");
const AUTTH = process.env.AUTH || "Dhruv@2015";
const fs = require('fs');


app.use(
  express.json({
    limit: 52428800,
  })
);
// app.use(express.limit(52428800));


const botToken = [
  "MTEyMzgzMjkwNTYxODE4MjIwNg.GnN9Rb.lUj99ZPHNnBjiFhn7prbSWsmw2_ebSAn4baI-k",
];
let chindex = {};
let botindex = 0;
const downloadM3u8Data = {};


for (let i = 0; i < botToken.length; i++) {
  const token = botToken[i];
  chindex[token] = 0;
}
const channelIds = [
  // "1124019739816120410",
  // "1124019841393762324",
  // "1124020309079621662",
  // "1124019856686190744",
  // "1124020333041696909",
  // "1124020345645572168",
  // "1124020358845055067",
  // "1124020371465699348",
  // "1124020386376450118",
  // "1124020409491279882",
  "1123832320441458800",
];


let browser;
let context;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getM3u8(url) {
  return new Promise(async (resolve, reject) => {
    const page = await context.newPage();
    let timeout;
    await page.setExtraHTTPHeaders({
      Referer: url,
    });
    page.on("request", async (request) => {
      let url = request.url();
      url = new URL(url);
      if (url.pathname.endsWith(".m3u8")) {
        await page.close();
        clearTimeout(timeout);
        resolve(url.toString());
      }
    });
    console.log(`fetching page ${url}`);
    await page.goto(url);
    console.log(`Waiting for m3u8 link in ${url}`);
    timeout = setTimeout(async () => {
      await page.close();
      reject("Timeout");
    }, 10000);
  });
}

const parseM3u8 = async (url) => {
  const returnThis = {
    videos: {},
  };

  let baseurl = url.split("/");
  baseurl[baseurl.length - 1] = "";
  baseurl = baseurl.join("/");
  let r = await fetch(url);
  let playlist = await r.text();
  returnThis["masterPlaylist"] = playlist;
  let parser = new m3u8Parser.Parser();
  parser.push(playlist);
  parser.end();
  parser.manifest.playlists;

  const manifest = parser.manifest.playlists;
  for (let i = 0; i < manifest.length; i++) {
    const { uri, attributes } = manifest[i];
    // console.log(manifest[i]);
    r = await fetch(baseurl + uri);
    playlist = await r.text();
    // RESOLUTION.height
    returnThis["masterPlaylist"] = returnThis["masterPlaylist"].replace(
      uri,
      attributes.RESOLUTION.height + ".m3u8"
    );
    returnThis["videos"][attributes.RESOLUTION.height] = {
      playlistName: attributes.RESOLUTION.height + ".m3u8",
      m3u8: playlist,
      segments: parse(playlist, baseurl),
    };
  }

  return returnThis;
};

function parse(m3u8, baseurl) {
  let parser = new m3u8Parser.Parser();
  parser.push(m3u8);
  parser.end();
  const returnThis = [];
  for (let i = 0; i < parser.manifest.segments.length; i++) {
    const element = parser.manifest.segments[i];
    returnThis.push({
      uri: `${baseurl}${element.uri}`,
      segments: element.uri,
      element: element,
    });
  }
  return returnThis;
}

async function uploadImageToDiscord(url, token) {
  // chindex[token];
  // console.log(`uploadImageToDiscord token : ${token}`);
  // console.log(`chindex[token] : ${chindex[token]}`);
  chindex[token] === channelIds.length - 1
    ? (chindex[token] = 0)
    : chindex[token]++;
  try {
    const fileStream = await fetch(url);
    const buffer = await fileStream.buffer();

    let formData = new FormData();

    let name = url.split("/");
    name = name[name.length - 1];
    name = name.split(".");
    name = name[0];
    formData.append("file", buffer, `${generateRandomString(5)}-${name}.dvvid`);

    try {
      const response = await axios.post(
        `https://discord.com/api/v9/channels/${channelIds[chindex[token]]}/messages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bot ${botToken}`,
          },
        }
      );
      return {
        success: true,
        data: response.data["attachments"],
      };
    } catch (error) {
      console.error("Error uploading image:", error.message);
      console.error("Error uploading image (error):", error);
      return {
        success: false,
        error: "error while uploading",
      };
    }
  } catch (error) {
    console.error("Error downloading image:", error.message);
    return {
      success: false,
      error: "error while downloading",
    };
  }
}

async function downloadM3u8(data, id, token) {
  // downloadM3u8Data[id];
  // console.log(`token: ${token}`);
  data.m3u8;
  data.segments;
  const len = data.segments.length;
  for (let i = 0; i < data.segments.length; i++) {
    const segment = data.segments[i];
    let file;
    // console.log(`Downloading: ${segment.uri}`);
    file = await uploadImageToDiscord(segment.uri, token);
    console.log(file);
    while (!file["success"]) {
      console.log(
        "download failed [" + id + "] " + segment.uri + " retrying in 5 sec"
      );
      sleep(5000);
      file = await uploadImageToDiscord(segment.uri, token);
    }
    let url = file["data"][0]["url"];
    downloadM3u8Data[id]["data"] = downloadM3u8Data[id]["data"].replace(
      segment.segments,
      url
    );
    console.log("Prograss [" + id + "]: " + downloadM3u8Data[id]["prograss"]);
    downloadM3u8Data[id]["prograss"] = (i * 100) / len;
  }
  // 30 * 60 * 1000
  setTimeout(() => {
    delete downloadM3u8Data[id];
  }, 30 * 60 * 1000);
  downloadM3u8Data[id]["status"] = "done";
  downloadM3u8Data[id]["prograss"] = 100;
  fs.writeFileSync(id, JSON.stringify(downloadM3u8Data[id]));
  fs.writeFileSync(id + ".m3u8", downloadM3u8Data[id]["data"]);
}

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

app.get("/", (req, res) => { 
  res.send("Hello World")
})

app.post("/parseM3u8", async (req, res) => {
  if (!req.body.url) return res.send("Please add url")
  const URL = req.body.url;
  res.send(await parseM3u8(URL));
})

app.get("/fetchM3u8", async (req, res) => {
  try {
    const m3u8 = await getM3u8(req.query.url);
    res.send({
      success: true,
      meu8: m3u8,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "timeout",
    });
  }
});


app.post("/downloadM3u8", async (req, res) => {
  if (req.body.auth != AUTTH)
    return res.status(403).send({ status: "unauthorised" });
  if (!req.body.data)
    return res.send({
      success: false,
      message: "please enter valid data",
    });
  const data = req.body.data;
  id = generateRandomString(10);
  // botindex;
  downloadM3u8Data[id] = {
    id: id,
    status: "processing",
    body: data,
    prograss: 0,
    data: data.m3u8,
  };
  botindex === botToken.length - 1 ? (botindex = 0) : botindex++;
  downloadM3u8(data, id, botToken[botindex]);
  return res.send({
    id: id,
    status: downloadM3u8Data[id]["status"],
    prograss: downloadM3u8Data[id]["prograss"],
    playlistName: downloadM3u8Data[id]["body"]["playlistName"],
    data: downloadM3u8Data[id]["data"],
  });
});

app.get("/downloadM3u8", (req, res) => {
  if (req.query.auth != AUTTH)
    return res.status(403).send({ status: "unauthorised" });
  if (!req.query.id)
    return res.status(401).send({ status: "Please enter video ID" });

  // downloadM3u8Data[req.query.id];
  res.send({
    status: downloadM3u8Data[req.query.id]["status"],
    prograss: downloadM3u8Data[req.query.id]["prograss"],
    data: downloadM3u8Data[req.query.id]["data"],
    playlistName: downloadM3u8Data[req.query.id]["body"]["playlistName"],
  });
});

app.get("/getM3u8/:id", (req, res) => {
  if (req.query.auth != AUTTH)
    return res.status(403).send({ status: "unauthorised" });
  
  if (!(fs.existsSync(req.params.id))) res.status(404).send("not found")
  res.sendFile(req.params.id, {root: "."});
})
app.get("/downloadM3u8/all", (req, res) => {
  if (req.query.auth != AUTTH)
    return res.status(403).send({ status: "unauthorised" });
  res.send(downloadM3u8Data);
});



app.listen(PORT, async () => {
  browser = await firefox.launch({ headless: headless });
  context = await browser.newContext();
  console.log("server is running on port 5555");
});

process.on("exit", async (code) => {
  await browser.close();
});
