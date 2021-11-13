import { parse } from "@babel/parser";
import { CodeGenerator } from "@babel/generator";
import fs from "fs";
import path from "path";
import prettier from "prettier";
import { byType } from "./utils/filter/byType.js";

const readFile = (path) => {
  return fs.readFileSync(path, { encoding: "utf-8" });
};

const getAst = (code) => {
  return parse(code, {
    sourceType: "module",
  });
};

const findTargetObjectAstSubtree = (astBody, objectName) => {
  return astBody
    .filter(byType("VariableDeclaration"))
    .find(({ declarations }) => {
      return declarations.find(({ id }) => id.name === objectName);
    });
};

const sortTargetObjectAstInPlace = (ast) => {
  ast.declarations[0].init.properties.sort((a, b) => {
    const aVal = a.key.name.toString();
    const bVal = b.key.name.toString();
    return aVal.localeCompare(bVal);
  });
};

const generateCodeWithSortedObject = (ast) => {
  const generator = new CodeGenerator(ast, {
    retainLines: true,
  });

  const { code } = generator.generate();

  const prettifiedCode = prettier.format(code, { parser: "babel" });

  return prettifiedCode;
};

const sortObjectInJsFile = (pathToFile, objectToSort) => {
  const code = readFile(pathToFile);

  const ast = getAst(code);

  const objectAstToSort = findTargetObjectAstSubtree(
    ast.program.body,
    objectToSort
  );

  sortTargetObjectAstInPlace(objectAstToSort);

  return generateCodeWithSortedObject(ast);
};

console.log(
  sortObjectInJsFile(
    path.resolve(process.cwd(), "fileToParse.js"),
    "translations"
  )
);
