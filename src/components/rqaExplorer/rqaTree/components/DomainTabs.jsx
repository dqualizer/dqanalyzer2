import React from "react";
import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { MdStar } from "react-icons/md";
import YourDomains from "./YourDomains";
export default function DomainTabs() {
  return (
    <Tabs.Group aria-label="Tabs with underline" style="underline">
      <Tabs.Item active icon={HiUserCircle} title="Yours">
        <YourDomains />
      </Tabs.Item>
      <Tabs.Item icon={MdStar} title="Starred">
        <p>
          This is
          <span className="font-medium text-gray-800 dark:text-white">
            Dashboard tab's associated content
          </span>
          . Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling.
        </p>
      </Tabs.Item>
    </Tabs.Group>
  );
}
