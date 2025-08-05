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
  attributeSelector.value = {
    "საგანი": ["მათემატიკა"],
    "კლასი": ["2"],
  };
  attributeSelector.addEventListener(
    "click",
    () => console.log(attributeSelector.value),
  );
}

init();
