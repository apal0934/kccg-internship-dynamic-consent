import React from "react";
import { Menu, Icon } from "antd";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;

function onClick() {
    console.log("Aaa");
}

const Header = () => {
    return (
        <Menu onClick={onClick} mode="horizontal">
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
                    <Link to={"/users"}></Link>
                </Menu.Item>
                <Menu.Item key="addUser">
                    <Icon type="user-add" />
                    Add user
                    <Link to={"/add_user"}></Link>
                </Menu.Item>
            </SubMenu>
            <SubMenu
                title={
                    <span>
                        <Icon type="check" />
                        Consents
                    </span>
                }
            >
                <Menu.Item key="consents">
                    <Icon type="file-protect" />
                    View consents
                    <Link to={"/consents"}></Link>
                </Menu.Item>
                <Menu.Item key="addConsent">
                    <Icon type="file-add" />
                    Add consent
                    <Link to={"/add_consent"}></Link>
                </Menu.Item>
            </SubMenu>
        </Menu>
    );
};

export default Header;
