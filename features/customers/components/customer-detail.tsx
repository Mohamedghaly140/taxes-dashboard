import Link from "next/link";
import {
  LucideArrowLeft,
  LucideUser,
  LucideMail,
  LucideKeyRound,
  LucideLock,
  LucideAtSign,
  LucideFileText,
  LucideReceipt,
  LucideIdCard,
  LucideCalendarPlus,
  LucideCalendarClock,
} from "lucide-react";
import type { Customer } from "@/generated/prisma/client";
import { CopyButton } from "./copy-button";
import { DeleteCustomerButton } from "./delete-customer-button";
import { EditCustomerButton } from "./edit-customer-button";

function getInitials(name: string) {
  return name
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

type FieldRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  mono?: boolean;
};

function FieldRow({ icon, label, value, mono }: FieldRowProps) {
  const isEmpty = value == null || value === "";
  return (
    <div className="group flex items-center justify-between py-3.5 px-5 hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <span className="shrink-0 text-muted-foreground">{icon}</span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
          {isEmpty ? (
            <p className="text-sm text-muted-foreground/50">—</p>
          ) : (
            <p
              className={`text-sm font-medium truncate ${mono ? "font-mono tracking-tight" : ""}`}
            >
              {value}
            </p>
          )}
        </div>
      </div>
      {!isEmpty && <CopyButton value={value!} />}
    </div>
  );
}

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
};

function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b bg-muted/30">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </h2>
      </div>
      <div className="divide-y">{children}</div>
    </div>
  );
}

export function CustomerDetail({ customer }: { customer: Customer }) {
  const initials = getInitials(customer.name);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back nav */}
      <Link
        href="/dashboard/customers"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <LucideArrowLeft className="size-4" />
        Back to Customers
      </Link>

      {/* Hero */}
      <div className="rounded-xl border bg-card p-6 flex items-center gap-5">
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-primary">{initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold truncate">{customer.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Added {formatShortDate(customer.createdAt)}
            <span className="mx-2 opacity-40">·</span>
            <span className="font-mono text-xs opacity-60">{customer.id}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <EditCustomerButton customer={customer} />
          <DeleteCustomerButton id={customer.id} name={customer.name} />
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Personal Information">
          <FieldRow
            icon={<LucideUser className="size-4" />}
            label="Full Name"
            value={customer.name}
          />
          <FieldRow
            icon={<LucideAtSign className="size-4" />}
            label="Username"
            value={customer.username}
          />
          <FieldRow
            icon={<LucideLock className="size-4" />}
            label="Portal Password"
            value={customer.portalPassword}
          />
          <FieldRow
            icon={<LucideMail className="size-4" />}
            label="Email Address"
            value={customer.email}
          />
          <FieldRow
            icon={<LucideKeyRound className="size-4" />}
            label="Email Password"
            value={customer.emailPassword}
          />
        </SectionCard>

        <SectionCard title="Tax & Identity">
          <FieldRow
            icon={<LucideFileText className="size-4" />}
            label="File Number"
            value={customer.fileNumber}
            mono
          />
          <FieldRow
            icon={<LucideReceipt className="size-4" />}
            label="Tax Registration No."
            value={customer.taxRegistrationNumber}
            mono
          />
          <FieldRow
            icon={<LucideIdCard className="size-4" />}
            label="National ID"
            value={customer.nationalId}
            mono
          />
        </SectionCard>
      </div>

      {/* Timestamps */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/30">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Activity
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x">
          <div className="flex items-center gap-3 px-5 py-4">
            <LucideCalendarPlus className="size-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Created</p>
              <p className="text-sm font-medium">
                {formatDate(customer.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-4">
            <LucideCalendarClock className="size-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Last Updated
              </p>
              <p className="text-sm font-medium">
                {formatDate(customer.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
