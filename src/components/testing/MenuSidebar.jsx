"use client";

import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import Logo from "../../assets/dqualizer_logo.png";
import { Link } from "react-router-dom";

export default function MenuSidebar() {
  return (
    <Sidebar aria-label="Sidebar with logo branding example">
      <Sidebar.Logo href="#" img={Logo} imgAlt="dqualizer Logo"></Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link className="flex" to="/dqedit/domains">
            <Sidebar.Item icon={HiChartPie}>Domains</Sidebar.Item>
          </Link>
          <Link className="flex" to="/dqedit/contexts">
            <Sidebar.Item icon={HiChartPie}>Contexts</Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
