import React from "react";
import Button from "antd/lib/button";
const query = require("./foo.graphql");

const style = require("./app.scss");

export class App extends React.Component<{}, { slogan: string }> {
  state = {
    slogan: "Hail Hydra"
  };

  showSecret = () => {
    console.log(query);
    this.setState({
      slogan: "Hale Hydra"
    });
  };

  render() {
    return (
      <div>
        <h1 className={style.h1}>{this.state.slogan}</h1>
        <Button onClick={this.showSecret}>secret</Button>
      </div>
    );
  }
}
