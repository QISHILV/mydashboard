/// <reference types="vite/client" />
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProjectsPage } from "./components/ProjectsPage";
import { ProjectDetailPage } from "./components/ProjectDetailPage";
import { TemplatesPage } from "./components/TemplatesPage";
import { TemplateConfigPage } from "./components/TemplateConfigPage";
import { TemplatesRedirect } from "./components/TemplatesRedirect";
import { DataConfigPage, DataSourcesPage, DataSetsPage, CreateDataSetPage, CreateDataSourcePage } from "./components/DataConfigPage";
import { DashboardEditor } from "./components/DashboardEditor";
import { PreviewPage } from "./components/PreviewPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Layout,
      children: [
        { index: true, Component: ProjectsPage },
        { path: "project/:projectId", Component: ProjectDetailPage },
        { path: "templates", Component: TemplatesRedirect },
        { path: "templates/market", Component: TemplatesPage },
        { path: "templates/config", Component: TemplateConfigPage },
        { path: "data-config", Component: DataConfigPage },
                { path: "data-config/data-sources", Component: DataSourcesPage },
                { path: "data-config/data-sources/create", Component: CreateDataSourcePage },
                { path: "data-config/data-sets", Component: DataSetsPage },
                { path: "data-config/data-sets/create", Component: CreateDataSetPage },
      ],
    },
    {
      path: "/editor/:id",
      Component: DashboardEditor,
    },
    {
      path: "/preview/:id",
      Component: PreviewPage,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
