import { useState } from "react";
import { CreateShoutSlideOver } from "../CreateShoutSlideOver";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import type { Page } from "../../types";

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function MainLayout({ children, currentPage, onNavigate }: MainLayoutProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} onCreateShout={() => setIsCreateOpen(true)} />
      <div className="pl-56">
        <TopBar currentPage={currentPage} onNavigate={onNavigate} onCreateShout={() => setIsCreateOpen(true)} />
        <main className="pt-16 px-8 pb-8">
          <div className="max-w-7xl mx-auto py-6">
            {children}
          </div>
        </main>
      </div>
      <CreateShoutSlideOver isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}