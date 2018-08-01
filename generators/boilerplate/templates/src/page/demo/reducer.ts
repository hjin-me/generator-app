import { Actions, ActTypes } from "../../actions";

// 用于拆分 redux store 的 key，不同 page 不能相同
export const name = "page_demo";
// state 的 interface，导出用于在 map**ToProps 做类型推断
export interface State {
  slogan: string;
}
// state 的初始值
export const defaultState = {
  slogan: "hail hydra"
};

// reducer
export function reducer(state: State = { ...defaultState }, action: Actions) {
  switch (action.type) {
    case ActTypes.ShowSecret: {
      return {
        ...state,
        slogan: action.payload
      };
    }
  }
  return state;
}
