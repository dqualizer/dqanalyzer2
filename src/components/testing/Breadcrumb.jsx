import React from "react";
import { useMatches } from "react-router-dom";

export default function Breadcrumb() {
  const matches = useMatches();
  console.log(matches);
  const crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) => Boolean(match.handle?.crumb))
    // now map them into an array of elements, passing the loader
    // data to each one
    .map((match) => match.handle.crumb(match.data));
  return (
    <nav
      class="flex flex-grow py-2 border-b-2 border-gray-200"
      aria-label="Breadcrumb"
    >
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        {crumbs.map((crumb, index) => (
          <li class="inline-flex items-center" key={index}>
            <div class="flex items-center">
              {index > 0 && (
                <svg
                  class="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              )}

              <a
                href="/"
                class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
              >
                {crumb}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
