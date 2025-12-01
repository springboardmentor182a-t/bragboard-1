import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
}

const PageContainer = ({ children, title }: PageContainerProps) => {
  return (
    <div className="p-6 w-full">
      {title && <h1 className="text-2xl font-semibold mb-4">{title}</h1>}
      {children}
    </div>
  );
};

export default PageContainer;
