import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/tabs';

import { ActiveAppointmentCard } from './ActiveAppointmentCard';

import { CompletedAppointmentCard } from './CompletedAppointmentCard';

import type { Appointment } from '../mock-data';

interface Props {
  active: Appointment[];

  completed: Appointment[];

  openSchedule: (a: Appointment) => void;

  reviewDrafts: Record<string, string>;

  setReviewDrafts: (
    value: (prev: Record<string, string>) => Record<string, string>,
  ) => void;

  saveReview: (id: string) => void;
}

export function AppointmentTabs({
  active,
  completed,
  openSchedule,
  reviewDrafts,
  setReviewDrafts,
  saveReview,
}: Props) {
  return (
    <Tabs defaultValue="active">
      <TabsList className="mb-6">
        <TabsTrigger value="active">
          Active applications
          <span className="ml-1.5 rounded-full bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px]">
            {active.length}
          </span>
        </TabsTrigger>

        <TabsTrigger value="completed">
          Completed sessions
          <span className="ml-1.5 rounded-full bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px]">
            {completed.length}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="mt-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {active.map((item) => (
            <ActiveAppointmentCard
              key={item.id}
              appointment={item}
              onSchedule={openSchedule}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="completed" className="mt-0">
        <div className="flex flex-col gap-4">
          {completed.map((item) => {
            const draft = reviewDrafts[item.id] ?? item.review ?? '';

            return (
              <CompletedAppointmentCard
                key={item.id}
                appointment={item}
                draft={draft}
                dirty={draft !== (item.review ?? '')}
                setDraft={(value) =>
                  setReviewDrafts((prev) => ({
                    ...prev,

                    [item.id]: value,
                  }))
                }
                onSave={() => saveReview(item.id)}
              />
            );
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
}
