import { Icon, Menu } from "antd";

import { Link } from "react-router-dom";
import React from "react";

const { SubMenu } = Menu;

const Header = () => {
    return (
        <Menu mode="horizontal">
            <Menu.Item key="home">
                <Icon type="home" />
                Home
                <Link to={"/"}></Link>
            </Menu.Item>
            <SubMenu
                title={
                    <span className="submenu-title-wrapper">
                        <Icon type="user" /> Users
                    </span>
                }
            >
                <Menu.Item key="users">
                    <Icon type="team" />
                    View users
                    <Link to={"/user/list"}></Link>
                </Menu.Item>
                <Menu.Item key="addUser">
                    <Icon type="user-add" />
                    Add user
                    <Link to={"/user/add"}></Link>
                </Menu.Item>
            </SubMenu>
        </Menu>
    );
};

export default Header;
