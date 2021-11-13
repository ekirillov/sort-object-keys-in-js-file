import { log } from "./mockImports/utils";

const FOO = "foo";

const translations = {
  b: "translation2",
  a: `
  
  asd
  
  `,
  c: `${FOO}-translation`,
  f: {
    translations: 123,
  },
};

export default translations;
