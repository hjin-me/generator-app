import * as React from "react";
import { connect } from "react-redux";
import { Demo as Component } from "./component";
import { Dispatch } from "redux";
import { Actions, ActTypes, RootState } from "../../actions";
import { name } from "./reducer";
import { withRouter } from "react-router-dom";

function mapStateToProps(rootState: RootState) {
  return {
    slogan: rootState[name].slogan
  };
}
function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    showSecret: () => {
      dispatch({
        type: ActTypes.ShowSecret,
        payload: "Hale Hydra"
      });
    }
  };
}
// 将纯展示组件与 redux 绑定
export const Demo = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Component)
);
