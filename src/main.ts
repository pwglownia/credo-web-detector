import App from "./App.svelte";
import theme from "./theme";

theme.createCssVariables();
theme.setMiscs();

const app = new App({ target: document.body });

export default app;
