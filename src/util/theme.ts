const setup = {
  primaryHue: 290,
  primarySaturation: 50, // %
  fontFamily: "Lato, sans-serif",
  whiteSpace: 12, // px
  borderRadius: 24, // px
};

const theme = {
  variables: {
    //  general
    primary: `hsl(${setup.primaryHue}, ${setup.primarySaturation}%, 50)`,
    fontFamily: setup.fontFamily,
    spaceSm: setup.whiteSpace + "px",
    spaceMd: setup.whiteSpace * 1.5 + "px",
    spaceLg: setup.whiteSpace * 2 + "px",
    spaceXl: setup.whiteSpace * 3 + "px",
    borderRadius: setup.borderRadius,
    // shoelace
    "sl-color-primary-hue": setup.primaryHue,
    "sl-color-primary-saturation": setup.primarySaturation + "%",
    "sl-font-sans": setup.fontFamily,
  },

  createCssVariables() {
    let root = document.documentElement;
    for (let [key, value] of Object.entries(this.variables)) {
      root.style.setProperty("--" + key.toString(), <string>value);
    }
  },

  setMiscs() {
    let meta = document.createElement("meta");
    meta.name = "theme-color";
    // meta.content = this.variables.backgroundDark; // TODO
    document.getElementsByTagName("head")[0].appendChild(meta);
  },
};

export default theme;
