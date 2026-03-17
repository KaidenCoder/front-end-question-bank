"use client";
import { useState } from "react";
import Link from "next/link";
import Card from "@/components/Card/JsFundamentals/Card";

export default function HomePage() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div>
      <div className="card-container">
        <Card
          title="JavaScript Runtime Visualizer"
          description="Explore execution context, event loop & async behavior"
          href="/simulator/js-runtime"
          cta="Open Simulator →"
        />
      </div>
    </div>
  );
}