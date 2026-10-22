import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import {
  NewAppointmentDialog,
  NewAppointmentDialogData,
} from '../../schedule/appointment-dialog/new-appointment-dialog';
import { confirm } from '../../shared/confirm-dialog';
import { InitialsPipe } from '../../shared/initials.pipe';
import { Client, ClientDraft, NEW_CLIENT_ID, Session, emptyClientDraft } from '../client.models';
import { ClientsStore } from '../clients.store';
import { DischargeDialog, DischargeDialogData } from '../discharge-dialog/discharge-dialog';

const SSN_PATTERN = /^(\d{3}-?\d{2}-?\d{4})?$/;

/** Parses `yyyy-MM-dd` as a local date (avoids the UTC shift of `new Date(string)`). */
function parseDateOnly(value: string | null): Date | null {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDateOnly(value: Date | null): string | null {
  if (!value) {
    return null;
  }
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${value.getFullYear()}-${month}-${day}`;
}

@Component({
  selector: 'pmt-client-detail',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    InitialsPipe,
  ],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDetail {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly store = inject(ClientsStore);

  /** Route parameter: a client id, or `new`. */
  readonly id = input.required<string>();

  protected readonly isNew = computed(() => this.id() === 'new');
  protected readonly clientId = computed(() => (this.isNew() ? NEW_CLIENT_ID : Number(this.id())));
  protected readonly client = computed<Client | undefined>(() =>
    this.store.clients().find((client) => client.id === this.clientId()),
  );
  protected readonly notFound = computed(
    () => !this.isNew() && this.store.loadStatus() === 'loaded' && !this.client(),
  );

  protected readonly sessions = computed(() => {
    const now = Date.now();
    const sorted = [...(this.client()?.sessions ?? [])].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );
    return {
      upcoming: sorted.filter((session) => new Date(session.start).getTime() >= now),
      past: sorted.filter((session) => new Date(session.start).getTime() < now).reverse(),
    };
  });

  protected readonly showSsn = signal(false);
  protected readonly selectedTab = signal(0);
  protected readonly maxBirthDate = new Date();

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    email: ['', Validators.email],
    secondaryEmail: ['', Validators.email],
    phone: [''],
    secondaryPhone: [''],
    ssn: ['', Validators.pattern(SSN_PATTERN)],
    dateOfBirth: this.fb.control<Date | null>(null),
    address: [''],
    city: [''],
    state: [''],
    zip: [''],
    insurance: this.fb.group({
      companyId: this.fb.control<number | null>(null),
      memberId: [''],
      companyPhone: [''],
    }),
  });

  /** Id the form was last populated for, so background refreshes don't wipe unsaved edits. */
  private populatedFor: number | null = null;

  constructor() {
    void this.store.loadInsuranceCompanies();

    effect(() => {
      const id = this.clientId();
      const client = this.client();
      untracked(() => {
        if (this.populatedFor !== id) {
          this.selectedTab.set(0);
        }
        if (this.populatedFor !== id || this.form.pristine) {
          this.populate(client);
          this.populatedFor = id;
        }
      });
    });
  }

  protected onInsuranceCompanyChange(companyId: number | null): void {
    const phone = this.form.controls.insurance.controls.companyPhone;
    const company = this.store.insuranceCompanies().find((c) => c.id === companyId);
    if (company?.phone && !phone.value) {
      phone.setValue(company.phone);
    }
  }

  protected async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const draft = this.toDraft();
    if (this.isNew()) {
      const created = await this.store.addClient(draft);
      if (created) {
        this.form.markAsPristine();
        await this.router.navigate(['/clients', created.id], { replaceUrl: true });
      }
    } else if (await this.store.updateClient(this.clientId(), draft)) {
      this.form.markAsPristine();
    }
  }

  protected revert(): void {
    this.populate(this.client());
  }

  protected async delete(): Promise<void> {
    const client = this.client();
    if (!client) {
      return;
    }
    const confirmed = await confirm(this.dialog, {
      title: `Delete ${client.name}?`,
      message: 'This permanently removes the client and all of their sessions.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (confirmed && (await this.store.deleteClient(client.id))) {
      await this.router.navigate(['/schedule']);
    }
  }

  protected discharge(): void {
    const client = this.client();
    if (client) {
      this.dialog.open<DischargeDialog, DischargeDialogData>(DischargeDialog, {
        data: { client },
        width: '480px',
      });
    }
  }

  protected bookSession(): void {
    const start = new Date();
    start.setHours(start.getHours() + 1, 0, 0, 0);
    this.dialog.open<NewAppointmentDialog, NewAppointmentDialogData>(NewAppointmentDialog, {
      data: { start, clientId: this.clientId() },
      width: '480px',
    });
  }

  protected async cancelSession(session: Session): Promise<void> {
    const confirmed = await confirm(this.dialog, {
      title: 'Cancel session?',
      message: 'This removes the session from the calendar.',
      confirmLabel: 'Cancel session',
      destructive: true,
    });
    if (confirmed) {
      await this.store.deleteSession(this.clientId(), session.id);
    }
  }

  private populate(client: Client | undefined): void {
    const source: ClientDraft = client ?? emptyClientDraft();
    this.form.reset({
      ...source,
      dateOfBirth: parseDateOnly(source.dateOfBirth),
      insurance: { ...source.insurance },
    });
    this.showSsn.set(false);
  }

  private toDraft(): ClientDraft {
    const value = this.form.getRawValue();
    return { ...value, dateOfBirth: formatDateOnly(value.dateOfBirth) };
  }
}
