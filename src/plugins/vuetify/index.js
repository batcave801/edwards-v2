import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { icons } from "./icons.js";

export default createVuetify({
  icons,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          background: "#ffffff",
          surface: "#ffffff",
          primary: "#c8102e",
          lightGrey: "b1b1b1",
          darkGrey: "#424242"
        },
      },
    },
  },
});
