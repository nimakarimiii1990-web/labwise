import React, { useEffect, useRef } from "react";
import "./NavigationTabs.css";

const tabs = [
  { id: "workbench", label: "میز کار" },
  { id: "directory", label: "فهرست آزمایش‌ها" },
  { id: "kit_ranges", label: "رنج کیت‌ها" },
  { id: "qc", label: "کنترل کیفی" },
  { id: "reagents", label: "معرف‌ها" },
  { id: "devices", label: "دستگاه‌ها" },
  { id: "articles", label: "مقالات" },
  { id: "ai_chat", label: "هوش مصنوعی" },
  { id: "inventory", label: "انبار" },
];

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = tabs.findIndex((t) => t.id === activeTab);
      let newIndex = currentIndex;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      }

      if (newIndex !== currentIndex) {
        onTabChange(tabs[newIndex].id);
        tabsRef.current[newIndex]?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, onTabChange]);

  return (
    <div className="tabs-wrapper" ref={wrapperRef}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(el) => { tabsRef.current[index] = el; }}
          className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => {
            onTabChange(tab.id);
            tabsRef.current[index]?.scrollIntoView({
              behavior: "smooth",
              inline: "center",
              block: "nearest",
            });
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
