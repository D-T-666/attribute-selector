// import { AttributeSelectorElement } from "./main.ts";
import "./main.ts";
import { AttributeSelectorElement } from "./main.ts";
const main = document.getElementById("main")!;

function init() {
  const attributeSelector = new AttributeSelectorElement();
  main.appendChild(attributeSelector);
  attributeSelector.options = {
    "საგანი": ["ქართული", "მათემატიკა"],
    "კლასი": ["1", "2"],
    "სირთულე": ["დაბალი", "საშუალო", "მაღალი"],
  };
}

init();
