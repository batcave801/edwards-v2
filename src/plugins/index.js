import vuetify from "./vuetify";
import { MotionPlugin } from '@vueuse/motion';

export default function registerPlugins(app) {
    app.use(vuetify).use(MotionPlugin);
}