"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var sketch_file_1 = require("@sketch-hq/sketch-file");
var fs = __importStar(require("fs"));
var path_1 = require("path");
var exampleImport_json_1 = __importDefault(require("../json/exampleImport.json"));
var sketchDocumentPath = "../theSketch.sketch";
function readSketchFileAndWriteJson() {
    // Load the Sketch document and parse it into a SketchFile object
    (0, sketch_file_1.fromFile)((0, path_1.resolve)(__dirname, sketchDocumentPath)).then(function (parsedFile) {
        // process the parsed file
        var document = parsedFile.contents.document;
        var theRes = document.pages[0].layers.filter(function (_a) {
            var name = _a.name, _class = _a._class;
            return name === "Information Module 01";
        });
        fs.writeFile("resultLimited.json", JSON.stringify(theRes, null, 2), function (err) {
            if (err)
                console.log("fuck");
        });
    });
}
function readJsonAndWriteSketchFile() {
    (0, sketch_file_1.fromFile)((0, path_1.resolve)(__dirname, sketchDocumentPath)).then(function (parsedFile) {
        parsedFile.contents.document = exampleImport_json_1["default"];
        parsedFile.contents.document;
        var exportableFile = {
            contents: parsedFile.contents,
            filepath: (0, path_1.resolve)(__dirname, "../json/resultWireframe.sketch")
        };
        (0, sketch_file_1.toFile)(exportableFile).then(function () {
            console.log("\u2705 Sketch file saved succesfully.");
        });
    });
}
function getModuleFromGroup(document, groupName, moduleName, positionY) {
    if (positionY === void 0) { positionY = 0; }
    var res = document.pages[0].layers.find(function (_a) {
        var name = _a.name, _class = _a._class;
        return name === groupName && ["symbolMaster"].includes(_class);
    }).layers.find(function (_a) {
        var name = _a.name, _class = _a._class;
        return name === moduleName && ["group", "artboard"].includes(_class);
    });
    res.name = [groupName, moduleName].join("-");
    res.frame.x = 0;
    res.frame.y = positionY;
    return res;
}
function sketchToWireframeSketch() {
    (0, sketch_file_1.fromFile)((0, path_1.resolve)(__dirname, sketchDocumentPath)).then(function (parsedFile) {
        var document = parsedFile.contents.document;
        var header = getModuleFromGroup(document, "Dynamic Blocks ", "Module 3");
        // console.log(header);
        var body = getModuleFromGroup(document, "Image layout", "Module 1", header.frame.height);
        // console.log(body);
        var footer = getModuleFromGroup(document, "UGC + Testimonial ", "Module 1", header.frame.height + body.frame.height);
        //  console.log(footer);
        parsedFile.contents.document.pages[0].layers = [header, body, footer];
        var exportableFile = {
            contents: parsedFile.contents,
            filepath: (0, path_1.resolve)(__dirname, "../sketches/wireframe/result.sketch")
        };
        (0, sketch_file_1.toFile)(exportableFile).then(function () {
            console.log("\u2705 Sketch file saved succesfully.");
        });
    });
}
sketchToWireframeSketch();
