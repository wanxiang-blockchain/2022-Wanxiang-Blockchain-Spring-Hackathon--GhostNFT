// @ts-nocheck
import React from "react";
import { ApplyPluginsType } from "/home/yijie/files/proj/bc/eth/gp/frontend/node_modules/umi/node_modules/@umijs/runtime";
import * as umiExports from "./umiExports";
import { plugin } from "./plugin";

export function getRoutes() {
  const routes = [
    {
      path: "/Explore",
      exact: true,
      component: require("@/pages/Explore/index.tsx").default,
    },
    {
      path: "/GamesPage",
      exact: true,
      component: require("@/pages/GamesPage/index.tsx").default,
    },
    {
      path: "/Home",
      exact: true,
      component: require("@/pages/Home/index.tsx").default,
    },
    {
      path: "/MyNftAssets",
      exact: true,
      component: require("@/pages/MyNftAssets/index.tsx").default,
    },
    {
      path: "/MyNftCollections",
      exact: true,
      component: require("@/pages/MyNftCollections/index.tsx").default,
    },
    {
      path: "/RentPage",
      exact: true,
      component: require("@/pages/RentPage/index.tsx").default,
    },
    {
      path: "/SingleNft",
      exact: true,
      component: require("@/pages/SingleNft/index.tsx").default,
    },
    {
      path: "/",
      exact: true,
      component: require("@/pages/index.tsx").default,
    },
  ];

  // allow user to extend routes
  plugin.applyPlugins({
    key: "patchRoutes",
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
