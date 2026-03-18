"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  className?: string;
};

export function Combobox({
  value,
  onChange,
  suggestions,
  placeholder = "Search or type...",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    if (!search) return suggestions.slice(0, 12);
    const q = search.toLowerCase();
    return suggestions.filter((s) => s.toLowerCase().includes(q)).slice(0, 12);
  }, [search, suggestions]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function select(item: string) {
    onChange(item);
    setSearch("");
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && search.trim()) {
      e.preventDefault();
      select(search.trim());
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <input
        ref={inputRef}
        value={open ? search : value}
        onChange={(e) => {
          setSearch(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          setSearch(value);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground placeholder:text-muted-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur outline-none transition hover:border-white/15 focus:border-primary/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-primary/15"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-[240px] overflow-y-auto rounded-xl border border-white/10 bg-card shadow-lg">
          {filtered.map((item) => (
            <button
              key={item}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(item)}
              className={cn(
                "w-full px-3 py-2 text-left text-sm transition cursor-pointer",
                item === value
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-white/5"
              )}
            >
              {item}
            </button>
          ))}
          {search && !filtered.some((f) => f.toLowerCase() === search.toLowerCase()) && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(search.trim())}
              className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-white/5 cursor-pointer border-t border-white/5"
            >
              Use &quot;{search}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

type ComboboxTagsProps = {
  value: string[];
  onChange: (value: string[]) => void;
  suggestions: string[];
  placeholder?: string;
  className?: string;
};

export function ComboboxTags({
  value,
  onChange,
  suggestions,
  placeholder = "Search or type and press Enter...",
  className,
}: ComboboxTagsProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const available = React.useMemo(() => {
    const existing = new Set(value.map((v) => v.toLowerCase()));
    const pool = suggestions.filter((s) => !existing.has(s.toLowerCase()));
    if (!search) return pool.slice(0, 10);
    const q = search.toLowerCase();
    return pool.filter((s) => s.toLowerCase().includes(q)).slice(0, 10);
  }, [search, suggestions, value]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function add(item: string) {
    if (!value.includes(item)) {
      onChange([...value, item]);
    }
    setSearch("");
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && search.trim()) {
      e.preventDefault();
      add(search.trim());
    }
    if (e.key === "Backspace" && !search && value.length > 0) {
      onChange(value.slice(0, -1));
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/10 px-2 py-0.5 text-xs text-foreground"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); remove(i); }}
              className="ml-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              x
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>
      {open && available.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-[200px] overflow-y-auto rounded-xl border border-white/10 bg-card shadow-lg">
          {available.map((item) => (
            <button
              key={item}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => add(item)}
              className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-white/5 cursor-pointer"
            >
              {item}
            </button>
          ))}
          {search && !available.some((a) => a.toLowerCase() === search.toLowerCase()) && !value.some((v) => v.toLowerCase() === search.toLowerCase()) && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => add(search.trim())}
              className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-white/5 cursor-pointer border-t border-white/5"
            >
              Add &quot;{search}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
