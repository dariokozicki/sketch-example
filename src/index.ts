import { fromFile, SketchFile, toFile } from "@sketch-hq/sketch-file";
import FileFormat from "@sketch-hq/sketch-file-format-ts";
import * as fs from "fs";
import { resolve } from "path";
import wireframe from "../json/exampleImport.json";

const sketchDocumentPath = "../theSketch.sketch";
function readSketchFileAndWriteJson() {
  // Load the Sketch document and parse it into a SketchFile object
  fromFile(resolve(__dirname, sketchDocumentPath)).then(
    (parsedFile: SketchFile) => {
      // process the parsed file

      const document = parsedFile.contents.document;
      const theRes = document.pages[0].layers.filter(
        ({ name, _class }) => name === "Information Module 01"
      );

      fs.writeFile(
        "resultLimited.json",
        JSON.stringify(theRes, null, 2),
        (err) => {
          if (err) console.log("fuck");
        }
      );
    }
  );
}

function readJsonAndWriteSketchFile() {
  fromFile(resolve(__dirname, sketchDocumentPath)).then(
    (parsedFile: SketchFile) => {
      parsedFile.contents.document = wireframe as any;
      parsedFile.contents.document;
      const exportableFile: SketchFile = {
        contents: parsedFile.contents,
        filepath: resolve(__dirname, "../json/resultWireframe.sketch"),
      };
      toFile(exportableFile).then(() => {
        console.log(`✅ Sketch file saved succesfully.`);
      });
    }
  );
}

function getModuleFromGroup(document, groupName, moduleName, positionY = 0) {
  const res = (
    document.pages[0].layers.find(
      ({ name, _class }) =>
        name === groupName && ["symbolMaster"].includes(_class)
    ) as FileFormat.SymbolMaster
  ).layers.find(
    ({ name, _class }) =>
      name === moduleName && ["group", "artboard"].includes(_class)
  );
  res.name = [groupName, moduleName].join("-");
  res.frame.x = 0;
  res.frame.y = positionY;
  return res;
}

function sketchToWireframeSketch() {
  fromFile(resolve(__dirname, sketchDocumentPath)).then(
    (parsedFile: SketchFile) => {
      const document = parsedFile.contents.document;
      const header = getModuleFromGroup(
        document,
        "Dynamic Blocks ",
        "Module 3"
      );

      // console.log(header);

      const body = getModuleFromGroup(
        document,
        "Image layout",
        "Module 1",
        header.frame.height
      );

      // console.log(body);

      const footer = getModuleFromGroup(
        document,
        "UGC + Testimonial ",
        "Module 1",
        header.frame.height + body.frame.height
      );

      //  console.log(footer);

      parsedFile.contents.document.pages[0].layers = [header, body, footer];

      const exportableFile: SketchFile = {
        contents: parsedFile.contents,
        filepath: resolve(__dirname, "../sketches/wireframe/result.sketch"),
      };
      toFile(exportableFile).then(() => {
        console.log(`✅ Sketch file saved succesfully.`);
      });
    }
  );
}

sketchToWireframeSketch();
