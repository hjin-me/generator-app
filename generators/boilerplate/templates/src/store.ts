import { applyMiddleware, combineReducers, createStore } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { ActTypes } from "./actions";
import {
  name as pageDemoName,
  reducer as pageDemoReducer
} from "./page/demo/reducer";
import { epics as pageDemoEpics } from "./page/demo/epics";

const epicMiddleware = createEpicMiddleware();
const middleware = [epicMiddleware];

if (DEBUG) {
  const { createLogger } = require("redux-logger");
  const logger = createLogger({
    level: "info",
    actionTransformer: action => {
      return Object.assign({}, action, {
        type: ActTypes[action.type] || action.type
      });
    }
  });
  middleware.push(logger);
}

const reducer = combineReducers({
  [pageDemoName]: pageDemoReducer
});

const store = createStore(reducer, applyMiddleware(...middleware));
epicMiddleware.run(combineEpics(pageDemoEpics));

export default store;
