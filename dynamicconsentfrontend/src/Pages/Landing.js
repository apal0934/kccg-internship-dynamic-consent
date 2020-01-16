import React from "react";
import { Icon } from "antd";

function Landing(props) {
    return (
        <Icon
            type="smile"
            style={{
                fontSize: "256px",
                position: "absolute",
                left: "50%",
                top: "50%",
                margin: "-128px 0 0 -128px"
            }}
        />
    );
}

export default Landing;
