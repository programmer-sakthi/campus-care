// components/ResultsSummary.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { useNavigate } from "react-router";
import { cn } from "@repo/ui/lib/utils";
import { DomainBar } from "./DomainBar";
import { CRISIS_RESOURCES } from "../constants/crisisResources";
import type { AuditResult } from "../types/emotionalAudit.types";

interface ResultsSummaryProps {
  result: AuditResult;
}

const categoryStyles: Record<AuditResult["overallCategory"], { badge: string; text: string; heading: string }> = {
  LOW: { badge: "bg-teal-100 text-teal-800", text: "text-teal-700", heading: "Low concern — keep it up" },
  MODERATE: { badge: "bg-amber-100 text-amber-800", text: "text-amber-700", heading: "Some things worth a closer look" },
  HIGH: { badge: "bg-orange-100 text-orange-800", text: "text-orange-700", heading: "We'd strongly encourage talking to someone" },
};

export function ResultsSummary({ result }: ResultsSummaryProps) {
  const navigate = useNavigate();

  // Even after a student clicks through the in-flow crisis screen, a
  // flagged submission always leads back here — the result never quietly
  // resolves to "just a score".
  if (result.safetyTriggered) {
    return (
      <Card className="rounded-2xl border-orange-200 bg-orange-50/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium text-orange-900">
            Your check-in has been saved
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-orange-900">
            Because of how you answered the safety questions, we're not
            showing a wellbeing score this time — instead, please take a
            moment to look at the support below. A counsellor will also be
            able to see this check-in if you reach out.
          </p>
          <div className="space-y-3">
            {CRISIS_RESOURCES.map((resource) => (
              <a
                key={resource.name}
                href={resource.href}
                className="block rounded-xl bg-white p-4 shadow-sm transition-colors hover:bg-orange-50"
              >
                <p className="text-sm font-semibold text-slate-800">{resource.name}</p>
                <p className="mt-1 text-xs text-slate-500">{resource.description}</p>
                <p className="mt-2 text-sm font-medium text-teal-700">{resource.contact}</p>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const styles = categoryStyles[result.overallCategory];

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium text-slate-700">{styles.heading}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end justify-between">
            <p className={cn("text-3xl font-semibold", styles.text)}>
              {result.overallScore}
              <span className="text-base font-normal text-slate-400">/100 concern</span>
            </p>
            <Badge className={cn("rounded-full", styles.badge)}>{result.overallCategory}</Badge>
          </div>
          {result.summary && <p className="text-sm text-slate-600">{result.summary}</p>}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium text-slate-700">Your profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.domainScores.map((domainScore) => (
            <DomainBar key={domainScore.domain} domainScore={domainScore} />
          ))}
        </CardContent>
      </Card>

      {result.insights.length > 0 && (
        <Card className="rounded-2xl border-slate-200 bg-slate-50/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium text-slate-700">
              <span aria-hidden>✨</span> Suggestions for you
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.insights.map((insight) => (
              <p key={insight} className="rounded-xl bg-white p-3 text-sm text-slate-600 shadow-sm">
                {insight}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {result.overallCategory !== "LOW" && (
        <Card className="rounded-2xl border-sky-200 bg-sky-50/60 shadow-sm">
          <CardContent className="flex flex-col items-start gap-3 p-5">
            <p className="text-sm text-sky-900">
              {result.overallCategory === "HIGH"
                ? "Talking to a counsellor could really help right now."
                : "A counsellor conversation could be a helpful next step, whenever you're ready."}
            </p>
            <Button variant="outline" className="rounded-xl border-sky-300 text-sky-800" onClick={() => navigate("/book-appointment")}>
              Book a counsellor appointment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
