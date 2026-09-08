import type { ReactNode } from "react";

// Shared building blocks for the resume-style pages. The visual language mirrors
// resume/design/resume.tpl.html in the job-hunt repo:
//   - detail pages: blue label band on the left, white / cream boxes alternating on the right
//   - poster / overview pages: solid blue sheet, Georgia-italic underlined headings, big numbers
// Grid rows stretch, so stacking rows without gaps keeps the band continuous.

export const GRID_CLASS =
  "grid grid-cols-1 sm:grid-cols-[12rem_minmax(0,1fr)] md:grid-cols-[15rem_minmax(0,1fr)]";
export const BAND_CLASS = "bg-brand text-white";
export const BULLET_CLASS =
  "pl-3 -indent-3 before:mr-1 before:font-black before:content-['·']";
export const LINK_CLASS =
  "underline underline-offset-4 hover:text-brand dark:hover:text-blue-300";
export const TAG_CLASS =
  "rounded-sm border border-brand/40 px-2 py-0.5 text-xs text-brand dark:border-blue-300/50 dark:text-blue-300";
export const BUTTON_PRIMARY_CLASS =
  "inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark";
export const BUTTON_SECONDARY_CLASS =
  "inline-flex shrink-0 items-center gap-2 rounded-lg border border-brand/50 px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-cream dark:border-blue-300/50 dark:text-blue-300 dark:hover:bg-zinc-900";
// Georgia-italic underlined heading used on the blue sheets.
export const SERIF_HEADING_CLASS =
  "font-serif text-xl font-bold italic underline decoration-1 underline-offset-4";

const BOX_CLASS = "px-6 py-3 text-sm leading-relaxed";
const BOX_ALT_CLASS = "bg-cream dark:bg-zinc-900";
const BOX_PLAIN_CLASS = "bg-white dark:bg-zinc-950";

export function boxClass(index: number): string {
  return `${BOX_CLASS} ${index % 2 === 0 ? BOX_ALT_CLASS : BOX_PLAIN_CLASS}`;
}

type ResumeFrameProps = {
  children: ReactNode;
};

// Rounded container that clips the band; wraps one or more ResumeSections.
export function ResumeFrame({ children }: ResumeFrameProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {children}
    </div>
  );
}

type ResumeSectionProps = {
  en: string;
  ko: string;
  caption: ReactNode;
  children: ReactNode;
};

export function ResumeSection({ en, ko, caption, children }: ResumeSectionProps) {
  return (
    <section className="contents">
      <div className={GRID_CLASS}>
        <div className={`${BAND_CLASS} px-5 pt-8 pb-3 sm:text-right`}>
          <h2 className="text-xl font-bold leading-tight">
            <span className="font-serif italic underline decoration-1 underline-offset-4">
              {en}
            </span>
            <span className="ml-2 whitespace-nowrap text-xs font-normal opacity-85">
              {ko}
            </span>
          </h2>
        </div>
        <div className="mx-6 flex items-end justify-end border-b border-brand/40 pt-8 pb-3 font-serif text-sm italic text-brand dark:text-blue-300">
          {caption}
        </div>
      </div>
      {children}
    </section>
  );
}

type ResumeRowProps = {
  // Plain text, or an element (e.g. <h2>, <Link>) when the label must carry semantics.
  label: ReactNode;
  sub?: ReactNode;
  date?: string;
  index: number;
  children: ReactNode;
};

export function ResumeRow({ label, sub, date, index, children }: ResumeRowProps) {
  return (
    <div className={GRID_CLASS}>
      <div className={`${BAND_CLASS} px-5 py-3 sm:text-right`}>
        <div className="font-semibold leading-snug">{label}</div>
        {sub !== undefined && (
          <div className="mt-0.5 text-sm leading-snug opacity-90">{sub}</div>
        )}
        {date !== undefined && (
          <div className="mt-0.5 font-serif text-sm opacity-85">{date}</div>
        )}
      </div>
      <div className={boxClass(index)}>{children}</div>
    </div>
  );
}

type ResumeFootProps = {
  left: ReactNode;
  right?: ReactNode;
};

// Closing row of a frame: italic footer on the band, optional right-hand note.
export function ResumeFoot({ left, right }: ResumeFootProps) {
  return (
    <div className={GRID_CLASS}>
      <div className={`${BAND_CLASS} px-5 py-4 font-serif text-sm italic opacity-90 sm:text-right`}>
        {left}
      </div>
      <div className="px-6 py-4 text-right font-serif text-sm italic text-brand dark:text-blue-300">
        {right}
      </div>
    </div>
  );
}

type StatTileProps = {
  value: string;
  unit?: string;
  label: string;
};

// Big-number tile for the blue Overview sheet (resume page 2).
export function StatTile({ value, unit, label }: StatTileProps) {
  // Long composite values (e.g. "1152px · 여백 0px") drop a size so they wrap cleanly.
  const valueSize = value.length > 6 ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl";
  return (
    <div className="min-w-0">
      <div className={`${valueSize} font-black leading-none tracking-tight`}>
        {value}
        {unit !== undefined && (
          <span className="ml-0.5 text-sm font-bold tracking-normal sm:text-base">{unit}</span>
        )}
      </div>
      <div className="mt-2 text-xs leading-snug opacity-90 sm:text-sm">{label}</div>
    </div>
  );
}
