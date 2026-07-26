"use client";

type ProjectHeaderProps = {
  name: string;
  description: string;
};

export function ProjectHeader({ name, description }: ProjectHeaderProps) {
  return (
    <header className="space-y-2">
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        {name}
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
    </header>
  );
}
