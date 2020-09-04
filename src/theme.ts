const setup = {
  primaryHue: 225,
  primarySaturation: 50, // %
  infoHue: 150,
  infoSaturation: 50,
  fontFamily: "Lato, sans-serif",
  whiteSpace: 12, // px
  borderRadius: 16, // px
};

const theme = {
  variables: {
    fontFamily: setup.fontFamily,
    // shoelace
    "sl-color-primary-hue": setup.primaryHue,
    "sl-color-primary-saturation": setup.infoSaturation + "%",
    "sl-info-primary-hue": setup.primaryHue,
    "sl-info-primary-saturation": setup.infoSaturation + "%",
    "sl-border-radius-large": setup.borderRadius + "px",
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
    meta.content = `hsl(${setup.primaryHue}, ${setup.primarySaturation}%, 15%)`; // TODO
    document.getElementsByTagName("head")[0].appendChild(meta);
  },
};

export default theme;
