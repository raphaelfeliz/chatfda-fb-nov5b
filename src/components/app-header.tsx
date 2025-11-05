"use client";

import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";

export function AppHeader() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-primary">FA</span>
          <span className="font-semibold text-foreground hidden sm:inline">Especialista da Fábrica</span>
        </div>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:flex">Início</Button>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            Fale Agora
          </Button>
        </nav>
      </div>
    </header>
  );
}