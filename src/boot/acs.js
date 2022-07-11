import Spn from 'components/acs/Spn'
import Spinner from 'components/acs/Spinner'
import Icn from 'components/acs/Icn'
import AdaptivePage from 'components/acs/AdaptivePage'

export default ({ app }) => {
  app.component('ac-spn', Spn)
  app.component('ac-spinner', Spinner)
  app.component('ac-icn', Icn)
  app.component('ac-adaptive-page', AdaptivePage)
}
