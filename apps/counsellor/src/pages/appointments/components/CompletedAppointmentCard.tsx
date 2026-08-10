import { Building2, CalendarClock, CheckCircle2, PenLine } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@repo/ui/components/card';

import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Label } from '@repo/ui/components/label';
import { Textarea } from '@repo/ui/components/textarea';

import { institutionOf, studentOf, type Appointment } from '../mock-data';

import { formatDateTime } from '../utils/date';

import { nameFont } from '../utils/styles';

interface Props {
  appointment: Appointment;

  draft: string;

  dirty: boolean;

  setDraft: (value: string) => void;

  onSave: () => void;
}

export function CompletedAppointmentCard({
  appointment,
  draft,
  dirty,
  setDraft,
  onSave,
}: Props) {
  const student = studentOf(appointment.studentId);

  const institution = institutionOf(student.institutionId);

  return (
    <Card className="border-neutral-200 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3
              className="text-lg font-medium text-neutral-900"
              style={nameFont}
            >
              {student.name}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />

                {institution.name}
              </span>

              <span className="flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5" />

                {formatDateTime(appointment.sessionAt)}
              </span>
            </div>
          </div>

          <Badge
            variant="outline"
            className="gap-1.5 border-neutral-200 text-neutral-500"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <p className="text-sm text-neutral-500">
          <span className="font-medium text-neutral-600">Reason:</span>{' '}
          {appointment.reason}
        </p>

        <div>
          <Label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-neutral-600">
            <PenLine className="h-3.5 w-3.5" />
            Session review
          </Label>

          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Summarize how the session went, any concerns, and follow-up plans..."
            className="min-h-[96px] resize-none text-sm"
          />
        </div>
      </CardContent>

      <CardFooter className="justify-end pt-0">
        <Button
          size="sm"
          disabled={!dirty}
          onClick={onSave}
          className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40"
        >
          {appointment.review ? 'Update review' : 'Save review'}
        </Button>
      </CardFooter>
    </Card>
  );
}
