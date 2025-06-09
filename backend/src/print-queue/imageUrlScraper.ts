import ky from "ky";
import * as cheerio from 'cheerio';

const PRINTABLES_GQL_API = 'https://api.printables.com/graphql/';

console.log(await getPrintablesImageUrl('https://www.printables.com/model/1244437-fox-mask'))

export async function getPrintablesImageUrl(url: string) {
    const modelId = url.split('/').at(-1)?.split('-')[0]
    if (!modelId) return null;
    const modelDetails = await ky.post(PRINTABLES_GQL_API, {
        headers: {
            "Content-type": 'application/json',
            "Accept": 'application/json'
        },
        json: {
            "operationName": "ModelDetail",
            "query": "query ModelDetail($id: ID!, $loadPurchase: Boolean!) {\n  model: print(id: $id) {\n    ...ModelDetailEditable\n    purchaseDate @include(if: $loadPurchase)\n    paidPrice @include(if: $loadPurchase)\n    giveawayDate @include(if: $loadPurchase)\n    mmu\n    user {\n      ...AvatarUser\n      isFollowedByMe\n      isHiddenForMe\n      canBeFollowed\n      billingAccountType\n      lowestTierPrice\n      highlightedModels {\n        models {\n          ...Model\n          __typename\n        }\n        featured\n        __typename\n      }\n      designer\n      stripeAccountActive\n      membership {\n        id\n        currentTier {\n          id\n          name\n          benefits {\n            id\n            title\n            benefitType\n            description\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    contests: competitions {\n      id\n      name\n      slug\n      description\n      isOpen\n      __typename\n    }\n    contestsResults: competitionResults {\n      ranking: placement\n      contest: competition {\n        id\n        name\n        slug\n        modelsCount: printsCount\n        openFrom\n        openTo\n        __typename\n      }\n      __typename\n    }\n    prusameterPoints\n    ...LatestContestResult\n    __typename\n  }\n}\nfragment AvatarUser on UserType {\n  id\n  handle\n  verified\n  dateVerified\n  publicUsername\n  avatarFilePath\n  badgesProfileLevel {\n    profileLevel\n    __typename\n  }\n  __typename\n}\nfragment LatestContestResult on PrintType {\n  latestContestResult: latestCompetitionResult {\n    ranking: placement\n    competitionId\n    __typename\n  }\n  __typename\n}\nfragment Model on PrintType {\n  id\n  name\n  slug\n  ratingAvg\n  likesCount\n  liked\n  datePublished\n  dateFeatured\n  firstPublish\n  downloadCount\n  mmu\n  category {\n    id\n    path {\n      id\n      name\n      nameEn\n      __typename\n    }\n    __typename\n  }\n  modified\n  image {\n    ...SimpleImage\n    __typename\n  }\n  nsfw\n  club: premium\n  price\n  user {\n    ...AvatarUser\n    isHiddenForMe\n    __typename\n  }\n  ...LatestContestResult\n  __typename\n}\nfragment ModelDetailEditable on PrintType {\n  id\n  slug\n  name\n  authorship\n  club: premium\n  excludeCommercialUsage\n  price\n  eduProject {\n    id\n    __typename\n  }\n  ratingAvg\n  myRating\n  ratingCount\n  description\n  category {\n    id\n    path {\n      id\n      name\n      nameEn\n      description\n      __typename\n    }\n    __typename\n  }\n  modified\n  firstPublish\n  datePublished\n  dateCreatedThingiverse\n  nsfw\n  summary\n  likesCount\n  makesCount\n  liked\n  printDuration\n  numPieces\n  weight\n  nozzleDiameters\n  usedMaterial\n  layerHeights\n  mmu\n  materials {\n    id\n    name\n    __typename\n  }\n  dateFeatured\n  downloadCount\n  displayCount\n  filesCount\n  privateCollectionsCount\n  publicCollectionsCount\n  pdfFilePath\n  commentCount\n  userGcodeCount\n  remixCount\n  canBeRated\n  printer {\n    id\n    name\n    __typename\n  }\n  image {\n    ...SimpleImage\n    __typename\n  }\n  images {\n    ...SimpleImage\n    __typename\n  }\n  tags {\n    name\n    id\n    __typename\n  }\n  thingiverseLink\n  filesType\n  previewFile {\n    ...PreviewFile\n    __typename\n  }\n  license {\n    id\n    disallowRemixing\n    __typename\n  }\n  remixParents {\n    ...RemixParent\n    __typename\n  }\n  remixDescription\n  __typename\n}\nfragment PreviewFile on PreviewFileUnionType {\n  ... on STLType {\n    id\n    filePreviewPath\n    __typename\n  }\n  ... on SLAType {\n    id\n    filePreviewPath\n    __typename\n  }\n  ... on GCodeType {\n    id\n    filePreviewPath\n    __typename\n  }\n  __typename\n}\nfragment RemixParent on PrintRemixType {\n  id\n  modelId: parentPrintId\n  modelName: parentPrintName\n  modelAuthor: parentPrintAuthor {\n    id\n    handle\n    verified\n    publicUsername\n    __typename\n  }\n  model: parentPrint {\n    ...RemixParentModel\n    __typename\n  }\n  url\n  urlAuthor\n  urlImage\n  urlTitle\n  urlLicense {\n    id\n    name\n    disallowRemixing\n    __typename\n  }\n  urlLicenseText\n  __typename\n}\nfragment RemixParentModel on PrintType {\n  id\n  name\n  slug\n  datePublished\n  image {\n    ...SimpleImage\n    __typename\n  }\n  club: premium\n  authorship\n  license {\n    id\n    name\n    disallowRemixing\n    __typename\n  }\n  eduProject {\n    id\n    __typename\n  }\n  __typename\n}\nfragment SimpleImage on PrintImageType {\n  id\n  filePath\n  rotation\n  imageHash\n  imageWidth\n  imageHeight\n  __typename\n}",
            "variables": {
                "id": modelId,
                "loadPurchase": false
            }
        }
    }).json<{data: {model: {image: {filePath: string | undefined}}}}>()
    const rawFilePath = modelDetails.data.model.image.filePath
    if (!rawFilePath) return null;
    const fileSplit = rawFilePath.split('/')
    const file = fileSplit.at(-1)!;
    const [fileName, fileType] = file.split('.')
    const fileDirectory = fileSplit.slice(0, fileSplit.length - 1).join('/');
    return `https://media.printables.com/${fileDirectory}/thumbs/inside/1600x1200/${fileType}/${fileName}.webp`
}
