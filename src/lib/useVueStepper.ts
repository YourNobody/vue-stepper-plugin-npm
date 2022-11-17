import { App, Plugin } from 'vue';
import VueStepper from './VueStepper.vue';

export const useVueStepper = (): Plugin => ({
  install(app: App) {
    app.component(VueStepper.name, VueStepper);
  },
});