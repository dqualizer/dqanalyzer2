"use client";

import { Sidebar } from "flowbite-react";
import { HiChartPie } from "react-icons/hi";
import { Link } from "react-router-dom";
import Logo from "../../assets/dqualizer_logo.png";

export default function MenuSidebar() {
  return (
    <Sidebar
      className="w-56 bg-slate-400"
      aria-label="Sidebar with logo branding example"
    >
      <Sidebar.Logo href="#" img={Logo} imgAlt="dqualizer Logo" />
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
