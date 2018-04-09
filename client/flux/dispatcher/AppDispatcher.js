import { Dispatcher } from 'flux'

// meanless to try decorate Dispatcher.prototype.dispatch,
// cause dispatch use hidden context

const AppDispatcher = new Dispatcher()

export default AppDispatcher