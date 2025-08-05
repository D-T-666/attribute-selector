import "./style.css";

export type AttributeSelectorOptions = {
  [category: string]: string[];
};

export class AttributeSelectorElement extends HTMLElement {
  #options: AttributeSelectorOptions = {};

  private addEntryButton: HTMLButtonElement;

  constructor() {
    super();
    this.addEntryButton = document.createElement("button");
  }

  set options(options: AttributeSelectorOptions) {
    this.#options = options;
    this.updateOtherOptions();
  }

  connectedCallback() {
    this.addEntryButton.innerText = "+";
    this.addEntryButton.addEventListener(
      "click",
      () => this.addEntryElement(),
    );

    this.appendChild(this.addEntryButton);
  }

  addEntryElement() {
    const entry = document.createElement("div");

    const categoryPicker = document.createElement("select");
    categoryPicker.appendChild(new Option("", "", true));
    (categoryPicker.firstChild as HTMLOptionElement).hidden = true;
    for (const c of Object.keys(this.#options)) {
      categoryPicker.appendChild(new Option(c, c));
    }
    categoryPicker.addEventListener(
      "change",
      () => this.updateOtherOptions(categoryPicker),
    );

    const valuePicker = document.createElement("select");
    valuePicker.appendChild(new Option("", "", true));
    (valuePicker.firstChild as HTMLOptionElement).hidden = true;
    valuePicker.addEventListener("change", () => {
      this.updateOtherOptions(valuePicker);
    });

    const removeButton = document.createElement("button");
    removeButton.addEventListener("click", () => {
      entry.remove();
      this.updateOtherOptions();
    });
    removeButton.innerText = "-";

    entry.append(categoryPicker, valuePicker, removeButton);

    this.insertBefore(entry, this.addEntryButton);
    this.updateOtherOptions();
  }

  #setOptionsForElement(
    elt: HTMLSelectElement,
    options: { [option: string]: boolean },
    reset: boolean = false,
  ) {
    const keys = Object.keys(options);
    if (reset) {
      elt.innerHTML = "";
      elt.appendChild(new Option("", "", true));
      (elt.firstChild as HTMLOptionElement).hidden = true;
      for (const key of keys) {
        elt.appendChild(new Option(key, key));
      }
    }
    console.log(elt.childNodes, keys, reset);
    let opt = elt.firstChild?.nextSibling as
      | HTMLOptionElement
      | null;
    for (let i = 0; i < keys.length; i++) {
      if (i < keys.length - 1 && opt === null) {
        throw new Error("select element has too few options");
      }
      opt!.disabled = !options[keys[i]];
      opt = opt!.nextSibling as HTMLOptionElement | null;
    }
  }

  updateOtherOptions(elt?: HTMLSelectElement) {
    const list: [string, string, number][] = [];
    const activeOptions: { [category: string]: { [value: string]: number } } =
      {};

    const entries = this.childNodes;
    for (let i = 0; i < entries.length - 1; i++) {
	    const categoryPicker = entries[i].childNodes[0] as HTMLSelectElement;
	    const valuePicker = entries[i].childNodes[1] as HTMLSelectElement;
      const [c, v] = [categoryPicker.value, valuePicker.value];

      if (c !== undefined && v !== undefined) {
        if (activeOptions[c] === undefined) {
          activeOptions[c] = {};
        }
        activeOptions[c][v] = list.length;
        list.push([c, v, i]);
      }
    }

    for (let i = 0; i < list.length; i++) {
      const [category, value, ind] = list[i];
      const categoryPicker = entries[ind].childNodes[0] as HTMLSelectElement;
	    const valuePicker = entries[ind].childNodes[1] as HTMLSelectElement;
      delete activeOptions[category][value];

      const availableOptions: {
        [category: string]: { [value: string]: boolean };
      } = {};
      const availableCategories = [];

      for (const category of Object.keys(this.#options)) {
        availableOptions[category] = {};
        let any = false;
        for (const value of this.#options[category]) {
          availableOptions[category][value] =
            activeOptions[category] === undefined ||
            activeOptions[category][value] === undefined;
          any ||= availableOptions[category][value];
        }
        if (any) {
          availableCategories.push(category);
        }
      }

      activeOptions[category][value] = i;

      const options: { [category: string]: boolean } = {};
      for (const category of Object.keys(this.#options)) {
        options[category] = availableCategories.includes(category);
      }
      this.#setOptionsForElement(categoryPicker, options);

      const reset = elt !== undefined && categoryPicker === elt &&
        this.#options[category] !== undefined;
      this.#setOptionsForElement(
        valuePicker,
        availableOptions[category] ?? {},
        reset,
      );
    }
  }
}

customElements.define("attribute-selector", AttributeSelectorElement);
