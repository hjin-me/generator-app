import * as React from "react";
import styled from "styled-components";
import { RouteComponentProps } from "react-router";

// 使用 styled-component 做样式组件化
const H1 = styled.h1`
  font-size: ${p => p.theme.fontXL};
  color: ${p => p.theme.danger};
`;
interface OwnProps {
  // just for tslint
  // useless
  demo: string;
}
export interface StateProps {
  slogan: string;
}
export interface DispatchProps {
  showSecret: () => void;
}

// 纯展示组件
export class Demo extends React.Component<
  OwnProps & StateProps & DispatchProps & RouteComponentProps<object>
> {
  render() {
    return (
      <div>
        <H1>{this.props.slogan}</H1>
        <button onClick={this.props.showSecret}>secret</button>
      </div>
    );
  }
}
