import ky from "ky";
import * as cheerio from "cheerio";

const PRINTABLES_GQL_API = "https://api.printables.com/graphql/";
// const getThingiverseApiUrl = (thingId: string) =>
//   `https://www.thingiverse.com/api/things/${thingId}/images?type=display&size=large`;

export async function getImageUrl(link: string): Promise<string | null> {
  const domain = new URL(link);
  const site = domain.hostname.replace("www.", "");
  switch (site) {
    case "makerworld.com":
      return getMakerWorldImageUrl(link);
    case "printables.com":
      return getPrintablesImageUrl(link);
    // case "thingiverse.com":
    //   return getThingiverseImageUrl(link);
    default:
      return null;
  }
}

// async function getThingiverseImageUrl(url: string) {
// const modelId = url.split(":").at(-1);
// if (!modelId) return null;
// const modelImageDetails = ky.get(getThingiverseApiUrl(modelId), {
//   headers: {
//     accept: "*/*",
//     referer: url,
//   },
// });
// }

async function getMakerWorldImageUrl(url: string) {
  const html = await ky.get(url).text();
  const $ = cheerio.load(html);
  const $img = $("img");
  return $img["1"].attribs?.src;
}

async function getPrintablesImageUrl(url: string) {
  const modelId = url.split("/").at(-1)?.split("-")[0];
  if (!modelId) return null;
  const modelDetails = await ky
    .post(PRINTABLES_GQL_API, {
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      json: {
        operationName: "ModelDetail",
        query:
          "query ModelDetail($id: ID!) {\n  model: print(id: $id) {\n    ...ModelDetailEditable\n    __typename\n  }\n}\nfragment ModelDetailEditable on PrintType {\n  image {\n    ...SimpleImage\n    __typename\n  }\n  images {\n    ...SimpleImage\n    __typename\n  }\n}\nfragment SimpleImage on PrintImageType {\n  id\n  filePath\n  rotation\n  imageHash\n  imageWidth\n  imageHeight\n  __typename\n}",
        variables: {
          id: modelId,
        },
      },
    })
    .json<{ data: { model: { image: { filePath: string | undefined } } } }>();
  const rawFilePath = modelDetails.data.model.image.filePath;
  if (!rawFilePath) return null;
  const fileSplit = rawFilePath.split("/");
  const file = fileSplit.at(-1)!;
  const [fileName, fileType] = file.split(".");
  const fileDirectory = fileSplit.slice(0, fileSplit.length - 1).join("/");
  return `https://media.printables.com/${fileDirectory}/thumbs/inside/1600x1200/${fileType}/${fileName}.webp`;
}
