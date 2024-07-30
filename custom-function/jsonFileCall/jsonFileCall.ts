import * as fs from "fs";

export const readJSON = (fileName: string) => {
  const readJSONFile = JSON.parse(
    fs.readFileSync(`../../json-file/${fileName}.json`, "utf-8")
  );
  return readJSONFile;
};
