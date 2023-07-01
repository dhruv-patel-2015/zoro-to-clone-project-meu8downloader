const fetch = require("node-fetch");
// const FormData = require("form-data");
const FormData = require("form-data");
const { Readable } = require("stream");

const extansions = [
  "rar",
  "xml",
  "tiff",
  "zip",
  "svg ",
  "xls ",
  "rtf",
  "doc",
  "eps",
  "psd",
  "js",
  "txt",
  "arj",
  "deb ",
  "pkg",
  "rpm",
  "tar.gz",
  "dmg ",
  "db",
  "tar",
  "sql",
  "apk",
  "ai ",
  "bmp",
  "key",
  "ppt",
  "pptx",
  "bak",
  "cab",
  "sys",
];

const botToken =
  "MTEyMzgzMjkwNTYxODE4MjIwNg.GnN9Rb.lUj99ZPHNnBjiFhn7prbSWsmw2_ebSAn4baI-k";

// 1123832905618182206
const channelIds = [
  1124019739816120410, 1124019841393762324, 1124020309079621662,
  1124019856686190744, 1124020333041696909, 1124020345645572168,
  1124020358845055067, 1124020371465699348, 1124020386376450118,
  1124020409491279882,
];

let chindex = 0;

function names(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
// current === servers.length - 1 ? (current = 0) : current++;
async function uploadFileToDiscord(url) {
  const channelId = channelIds[chindex];
  chindex === channelIds.length - 1 ? (chindex = 0) : chindex++;
  const fileResponse = await fetch(url);
    const fileBuffer = await fileResponse.buffer();
    // console.log(fileBuffer);
  let name = url.split("/");
  name = name[name.length - 1];
  name = name.split(".");
  name = name[0];

  console.log(typeof fileBuffer);

  let formData = new FormData();
  formData.append("content", "hhhhhhheeeeeeeeeeeeeeeee");
  formData.append("file", fileBuffer, `hello.png`);
  // formData.append("content", "conedatent");
    console.log(formData);

  new Blob();

  const uploadResponse = await fetch(
    `https://discord.com/api/v10/channels/1123832473084768256/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "multipart/form-data",

        // "Content-Type": "application/json",
        //https://discord.com/api/v9/channels/1123832320441458800/attachments
      },
      body: formData,
    }
    );
    console.log(uploadResponse);

  const uploadData = await uploadResponse.json();
  console.log(JSON.stringify(uploadData));
}

// (async () => {
//     for (let i = 0; i < 10; i++) {
//         await uploadFileToDiscord(
//           "https://cdn.discordapp.com/attachments/1121415609029242953/1124022894142439444/pokemon.jpg"
//         );
//     }
// })()

uploadFileToDiscord(
  "https://img.zorores.com/_r/300x400/100/0d/2d/0d2d0a1d4276e7e2595702dc4cebbda9/0d2d0a1d4276e7e2595702dc4cebbda9.jpeg"
);

// fetch("https://discord.com/api/v9/channels/1123832320441458800/messages", {
//   headers: {
//     accept: "*/*",
//     "accept-language": "en,en-US;q=0.9,hi;q=0.8,gu;q=0.7",
//     authorization:
//       "ODE5MjA3ODIzODgyODQ2Mjc4.G6dh4n.MBHM_BB2v8gk5iAgRiwucgMuXZznrelqf6UV-Y",
//     "content-type": "application/json",
//     "sec-ch-ua":
//       '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": '"Windows"',
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-debug-options": "bugReporterEnabled",
//     "x-discord-locale": "en-US",
//     "x-discord-timezone": "Asia/Calcutta",
//     "x-super-properties":
//       "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzExNC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTE0LjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjIwOTgyMCwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=",
//     cookie:
//       "__dcfduid=e6c95010a17211edac6385e05df6d384; __sdcfduid=e6c95011a17211edac6385e05df6d384e0e361161ff83e2fde023c1f28c79d19ef18619159e2a51590776107c769bb0c; _gcl_au=1.1.2028665204.1686902402; _ga=GA1.1.1323083778.1677503992; OptanonConsent=isIABGlobal=false&datestamp=Sun+Jun+25+2023+11%3A24%3A50+GMT%2B0530+(India+Standard+Time)&version=6.33.0&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1&AwaitingReconsent=false; _ga_Q149DFWHT7=GS1.1.1687672490.5.1.1687672514.0.0.0; __cfruid=ea2718eed59df9219ff318f64b7042e3cabe6f76-1688008334; __cf_bm=DOXvzaeLXxtcDwFmvsAiGzfkqiqLep1tu5xUCunYRYw-1688061618-0-AcLrgS9m4+rSdXYSzLqFdVFhj1lfNaopxIDFLN5vSg8YClycrd3JhRg2rMft6B08Aw==",
//     Referer:
//       "https://discord.com/channels/1123832319829102602/1123832320441458800",
//     "Referrer-Policy": "strict-origin-when-cross-origin",
//   },
//   body: '{"content":"","nonce":"1124036716957532160","channel_id":"1123832320441458800","type":0,"sticker_ids":[],"attachments":[{"id":"0","filename":"package.json","uploaded_filename":"0dc53ac9-218b-4794-bec9-92c003a4bc0b/package.json"}]}',
//   method: "POST",
// });
