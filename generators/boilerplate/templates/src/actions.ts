import {
  name as pageDemoName,
  State as pageDemoState
} from "./page/demo/reducer";
export interface DataState {
  [pageDemoName]: pageDemoState;
}

interface UIState {
  loading: object;
}

export type RootState = DataState & UIState;

export enum ActTypes {
  Nil = 0,
  DemoPageIn,
  ShowSecret
}

export interface ActionNil {
  type: ActTypes.Nil;
}

/**
 * 页面切换事件
 */
export interface ActionDemoPageIn {
  type: ActTypes.DemoPageIn;
}

/**
 * 展示隐藏的密码
 */
export interface ActionShowSecret {
  type: ActTypes.ShowSecret;
  payload: string;
}
export type Actions = ActionNil | ActionDemoPageIn | ActionShowSecret;
