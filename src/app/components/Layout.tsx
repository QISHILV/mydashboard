import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import {
  Plus,
  FolderOpen,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  FileBarChart,
  Store,
  Folder,
  Database,
  FolderPlus,
  Check,
  X,
  Table2,
  ShoppingBag,
  Settings,
  Download,
  FileText,
} from "lucide-react";
import { useDashboards } from "./DashboardContext";

export function Layout() {
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState("未命名仪表盘");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [mySpaceOpen, setMySpaceOpen] = useState(true);
  const [dataConfigOpen, setDataConfigOpen] = useState(true);
  const [templateMarketOpen, setTemplateMarketOpen] = useState(true);
  const [systemOpen, setSystemOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Inline new project in sidebar
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const sidebarProjectInputRef = useRef<HTMLInputElement>(null);
  // Inline new project in modal
  const [isCreatingProjectInModal, setIsCreatingProjectInModal] = useState(false);
  const [newProjectNameInModal, setNewProjectNameInModal] = useState("");
  const modalProjectInputRef = useRef<HTMLInputElement>(null);
  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { projects, addProject, addDashboard } = useDashboards();

  const sortedProjects = [...projects].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const openNewModal = () => {
    setNewName("未命名仪表盘");
    setSelectedProjectId(null);
    setIsCreatingProjectInModal(false);
    setNewProjectNameInModal("");
    setDropdownOpen(false);
    setShowNewModal(true);
  };

  const handleConfirmCreate = () => {
    const name = newName.trim() || "未命名仪表盘";
    const id = addDashboard(selectedProjectId, name);
    setShowNewModal(false);
    navigate(`/editor/${id}`);
  };

  // Sidebar: create project inline
  const handleStartCreateProject = () => {
    setIsCreatingProject(true);
    setNewProjectName("");
    setMySpaceOpen(true);
    setTimeout(() => sidebarProjectInputRef.current?.focus(), 50);
  };

  const handleConfirmCreateProject = () => {
    const name = newProjectName.trim();
    if (name) {
      const id = addProject(name);
      navigate(`/project/${id}`);
    }
    setIsCreatingProject(false);
    setNewProjectName("");
  };

  const handleCancelCreateProject = () => {
    setIsCreatingProject(false);
    setNewProjectName("");
  };

  // Modal: create project inline
  const handleStartCreateProjectInModal = () => {
    setIsCreatingProjectInModal(true);
    setNewProjectNameInModal("");
    setTimeout(() => modalProjectInputRef.current?.focus(), 50);
  };

  const handleConfirmCreateProjectInModal = () => {
    const name = newProjectNameInModal.trim();
    if (name) {
      const id = addProject(name);
      setSelectedProjectId(id);
    }
    setIsCreatingProjectInModal(false);
    setNewProjectNameInModal("");
  };

  const handleCancelCreateProjectInModal = () => {
    setIsCreatingProjectInModal(false);
    setNewProjectNameInModal("");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setIsCreatingProjectInModal(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (dropdownOpen || userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, userMenuOpen]);

  const selectedProjectLabel = selectedProjectId
    ? sortedProjects.find((p) => p.id === selectedProjectId)?.name ?? "不归属项目"
    : "不归属项目";

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'w-[64px]' : 'w-[260px]'}`}>
        {/* Logo / Brand */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-slate-100">
          <div className={`flex items-center gap-2.5 transition-all ${sidebarCollapsed ? 'hidden' : 'flex'}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] text-slate-800 tracking-tight">
              myview
            </span>
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title={sidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* New Button */}
        <div className="px-4 py-4">
          <button
            onClick={() => openNewModal()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>新建仪表盘</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 overflow-y-auto py-1">
          {/* My Space */}
          <div className="mb-2">
            <button
              onClick={() => setMySpaceOpen(!mySpaceOpen)}
              className="w-full flex items-center gap-2 px-2 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {mySpaceOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
              <FolderOpen className="w-4 h-4" />
              <span className="text-[14px] flex-1 text-left">我的空间</span>
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartCreateProject();
                }}
                className="p-0.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                title="新建项目"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </span>
            </button>
            {mySpaceOpen && (
              <div className="ml-4">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-[13px] ${isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  <FileBarChart className="w-3.5 h-3.5" />
                  <span>全部仪表盘</span>
                </NavLink>

                {sortedProjects.map((project) => (
                  <NavLink
                    key={project.id}
                    to={`/project/${project.id}`}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-[13px] mt-0.5 ${isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-500 hover:bg-slate-50"
                      }`
                    }
                  >
                    <Folder className="w-3.5 h-3.5" />
                    <span className="truncate">{project.name}</span>
                  </NavLink>
                ))}

                {/* Inline new project input */}
                {isCreatingProject && (
                  <div className="flex items-center gap-1 px-2 py-1 mt-0.5">
                    <Folder className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <input
                      ref={sidebarProjectInputRef}
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleConfirmCreateProject();
                        if (e.key === "Escape") handleCancelCreateProject();
                      }}
                      placeholder="项目名称"
                      className="flex-1 min-w-0 text-[13px] bg-white border border-blue-300 rounded px-1.5 py-0.5 outline-none text-slate-800 placeholder:text-slate-400"
                    />
                    <button
                      onClick={handleConfirmCreateProject}
                      className="p-0.5 rounded hover:bg-emerald-100 text-emerald-600 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleCancelCreateProject}
                      className="p-0.5 rounded hover:bg-red-100 text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Template Market */}
          <div className="mb-2">
            <button
              onClick={() => setTemplateMarketOpen(!templateMarketOpen)}
              className={`w-full flex items-center gap-2 px-2 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors ${!sidebarCollapsed ? 'justify-between' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                {!sidebarCollapsed && <span className="text-[14px] text-left">模板中心</span>}
              </div>
              {!sidebarCollapsed && (
                templateMarketOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )
              )}
            </button>
            {templateMarketOpen && !sidebarCollapsed && (
              <div className="ml-4">
                <NavLink
                  to="/templates/config"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-[13px] ${isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                      }`
                  }
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>我的模板</span>
                </NavLink>
                <NavLink
                  to="/templates/market"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-[13px] mt-0.5 ${isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                      }`
                  }
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>模板集市</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Data Config */}
          <div className="mb-2">
            <button
              onClick={() => setDataConfigOpen(!dataConfigOpen)}
              className={`w-full flex items-center gap-2 px-2 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors ${!sidebarCollapsed ? 'justify-between' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                {!sidebarCollapsed && <span className="text-[14px] text-left">数据配置</span>}
              </div>
              {!sidebarCollapsed && (
                dataConfigOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )
              )}
            </button>
            {dataConfigOpen && !sidebarCollapsed && (
              <div className="ml-4">
                <NavLink
                  to="/data-config/data-sources"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-[13px] ${isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                      }`
                  }
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>数据源</span>
                </NavLink>

                <NavLink
                  to="/data-config/data-sets"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-[13px] mt-0.5 ${isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                      }`
                  }
                >
                  <Table2 className="w-3.5 h-3.5" />
                  <span>数据集</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* System Management */}
          <div className="mb-2">
            <button
              onClick={() => setSystemOpen(!systemOpen)}
              className={`w-full flex items-center gap-2 px-2 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors ${!sidebarCollapsed ? 'justify-between' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {!sidebarCollapsed && <span className="text-[14px] text-left">系统管理</span>}
              </div>
              {!sidebarCollapsed && (
                systemOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )
              )}
            </button>
            {systemOpen && !sidebarCollapsed && (
              <div className="ml-4">
                <NavLink
                  to="/system/download-center"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-[13px] ${isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                      }`
                  }
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载中心</span>
                </NavLink>
              </div>
            )}
          </div>
        </nav>


      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="h-14 px-6 flex items-center justify-end border-b border-slate-200">
          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[12px]">
                U
              </div>
              <span className="text-[13px] text-slate-600">用户</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>
            
            {/* User Menu */}
            {userMenuOpen && (
              <div ref={userMenuRef} className="absolute right-0 top-[calc(100%+4px)] bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 min-w-[180px]">
                <button
                  onClick={() => navigate("/data-config/data-models")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>数据集成平台</span>
                </button>
                <button
                  onClick={() => console.log("退出登录")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>退出登录</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>

      {/* New Dashboard Modal */}
      {showNewModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
          onClick={() => setShowNewModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[460px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-slate-800 mb-5">新建仪表盘</h3>

            {/* Name input */}
            <div className="mb-5">
              <label className="text-[13px] text-slate-600 mb-1.5 block">
                仪表盘名称
              </label>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConfirmCreate();
                }}
                placeholder="请输入仪表盘名称"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Project selector */}
            <div className="mb-6">
              <label className="text-[13px] text-slate-600 mb-1.5 block">
                归属项目
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-[14px] transition-colors outline-none ${dropdownOpen
                    ? "border-blue-400 ring-1 ring-blue-100"
                    : "border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <span className="flex items-center gap-2 text-slate-800">
                    {selectedProjectId ? (
                      <Folder className="w-4 h-4 text-slate-400" />
                    ) : (
                      <FileBarChart className="w-4 h-4 text-slate-400" />
                    )}
                    {selectedProjectLabel}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 max-h-[240px] overflow-y-auto">
                    {/* No project option */}
                    <button
                      onClick={() => {
                        setSelectedProjectId(null);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] transition-colors text-left ${selectedProjectId === null
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      <FileBarChart className="w-4 h-4 shrink-0" />
                      <span className="flex-1">不归属项目</span>
                      {selectedProjectId === null && <Check className="w-3.5 h-3.5 text-blue-500" />}
                    </button>

                    {/* Divider */}
                    {sortedProjects.length > 0 && (
                      <div className="border-t border-slate-100 my-1" />
                    )}

                    {/* Project options */}
                    {sortedProjects.map((proj) => (
                      <button
                        key={proj.id}
                        onClick={() => {
                          setSelectedProjectId(proj.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] transition-colors text-left ${selectedProjectId === proj.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        <Folder className="w-4 h-4 shrink-0" />
                        <span className="flex-1 truncate">{proj.name}</span>
                        {selectedProjectId === proj.id && <Check className="w-3.5 h-3.5 text-blue-500" />}
                      </button>
                    ))}

                    {/* Divider before new project */}
                    <div className="border-t border-slate-100 my-1" />

                    {/* New project inline */}
                    {isCreatingProjectInModal ? (
                      <div className="flex items-center gap-1.5 px-3 py-2">
                        <FolderPlus className="w-4 h-4 text-blue-500 shrink-0" />
                        <input
                          ref={modalProjectInputRef}
                          value={newProjectNameInModal}
                          onChange={(e) => setNewProjectNameInModal(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleConfirmCreateProjectInModal();
                              setDropdownOpen(false);
                            }
                            if (e.key === "Escape") handleCancelCreateProjectInModal();
                          }}
                          placeholder="输入项目名称后回车"
                          className="flex-1 min-w-0 text-[13px] bg-white border border-blue-300 rounded px-2 py-1 outline-none text-slate-800 placeholder:text-slate-400"
                        />
                        <button
                          onClick={() => {
                            handleConfirmCreateProjectInModal();
                            setDropdownOpen(false);
                          }}
                          className="p-1 rounded hover:bg-emerald-100 text-emerald-600 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={handleCancelCreateProjectInModal}
                          className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleStartCreateProjectInModal}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left"
                      >
                        <FolderPlus className="w-4 h-4 shrink-0" />
                        <span>新建项目</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmCreate}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}