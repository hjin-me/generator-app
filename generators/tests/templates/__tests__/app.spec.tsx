import * as React from "react";
import { findDOMNode } from "react-dom";
import { renderIntoDocument, Simulate } from "react-dom/test-utils";
import { App } from "../src/app";

describe("App", () => {
  let app;

  beforeEach(() => {
    app = renderIntoDocument(<App />);
  });
  it("slogan", () => {
    const appDOM = findDOMNode(app) as Element;
    const node = appDOM.querySelector("h1");
    expect(node.innerHTML.trim()).toBe("Hail Hydra");
  });

  it("show secret", () => {
    // 触发点击事件
    const appDOM = findDOMNode(app) as Element;
    const node = appDOM.querySelector("h1");

    // antd 的 Button 内部是个 button
    const button = appDOM.querySelector("button");
    // 模拟点击
    Simulate.click(button);

    expect(node.innerHTML.trim()).toBe("Hale Hydra");
  });
});
