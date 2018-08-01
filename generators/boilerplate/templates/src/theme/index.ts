import * as styledComponents from "styled-components";

const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider
} = styledComponents as styledComponents.ThemedStyledComponentsModule<
  ThemeInterface
>;

export interface ThemeInterface {
  danger: string;
  fontS: string;
  fontM: string;
  fontL: string;
  fontXL: string;
}

// styled-component 的主题功能
export const theme: ThemeInterface = {
  danger: "#f5222d", //红色提示或者预警
  fontS: "12px",
  fontM: "14px",
  fontL: "16px",
  fontXL: "18px"
};

export default styled;
export { css, injectGlobal, keyframes, ThemeProvider };
