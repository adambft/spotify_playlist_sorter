import './assets/main.css'

import bootstrapPopovers from './js_methods/bootstrap_popover'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faArrowRight, faBackward, faCircleCheck, faCirclePlus, faCircleQuestion, faFloppyDisk, faForward, faGear, faHandPointer, faListUl, faMagnifyingGlass, faMusic, faPause, faPlay, faShuffle, faSpinner, faThumbsUp, faUserCircle, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library (ADD NEW ICONS HERE v) */
library.add(faSpinner, faArrowRight, faMusic, faListUl, faHandPointer, faSpotify, faUserCircle, faCircleQuestion, faFloppyDisk, faCircleCheck, faCirclePlus, faMagnifyingGlass, faPlay, faPause, faForward, faBackward, faVolumeHigh, faGear, faThumbsUp, faShuffle)

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'

const app = createApp(App)

app.use(router)
app.use(bootstrapPopovers)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
