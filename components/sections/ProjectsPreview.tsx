import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import { Cta } from "@/components/ui/Bits";
import { projects, type Project } from "@/lib/data/projects";

const TONES = ["orange", "cream", "ink", "orange"] as const;
const TILT = [-5, 4, -3, 5];
const SPEED = [0.12, -0.08, 0.2, -0.04];

export function projectTitle(p: Project) {
  return p.placeholder ? `Project ${p.index}` : p.title;
}

export function ProjectCard({ p, i, tilt = true }: { p: Project; i: number; tilt?: boolean }) {
  const body = (
    <Link
      href={`/projects/${p.slug}`}
      data-tilt
      data-cursor="View"
      className="card group block overflow-hidden bg-paper"
      aria-label={`${projectTitle(p)} — ${p.category}`}
    >
      <div className="relative border-b-2 border-ink">
        <SmartImage
          src={p.image}
          alt={`${projectTitle(p)} — ${p.category}`}
          plate={p.plate}
          tone={TONES[i % 4]}
          parallax={-0.12}
          className="aspect-[4/3] w-full"
        />
        <span className="label absolute left-3 top-3 bg-ink px-3 py-2 text-cream">{p.index}</span>
        {p.placeholder && (
          <span className="label absolute right-3 top-3 bg-cream px-3 py-2">Details soon</span>
        )}
      </div>
      <div className="flex items-end justify-between gap-4 p-5 text-ink">
        <div>
          <h3 className="h3">{projectTitle(p)}</h3>
          <p className="label mt-3 text-ink-70">{p.category}</p>
        </div>
        <span className="font-display text-3xl leading-none transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2" aria-hidden>
          →
        </span>
      </div>
    </Link>
  );

  if (!tilt) return body;
  return (
    <div data-parallax-scope>
      <div data-parallax={SPEED[i % 4]}>
        <div data-rotate={TILT[i % 4]}>{body}</div>
      </div>
    </div>
  );
}

export default function ProjectsPreview() {
  return (
    <section
      data-parallax-scope
      className="on-dark relative overflow-hidden bg-rust py-[var(--spacing-section)] text-cream"
      aria-labelledby="work-title"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          data-parallax-x="-0.8"
          className="font-display outline-cream absolute top-[2%] whitespace-nowrap text-[clamp(10rem,34vw,34rem)] uppercase leading-none"
        >
          Our work · Our work ·
        </div>
        <div className="hazard absolute inset-x-0 top-0 h-3" />
      </div>

      <div className="shell relative">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8 lg:mb-24">
          <div>
            <p className="label flex items-center gap-3">
              <span className="bg-cream px-2 py-1 text-ink">04</span>
              Proof
            </p>
            <h2 id="work-title" className="h2 mt-6" data-split>
              Work that
              <br />
              speaks first.
            </h2>
          </div>
          <div data-reveal>
            <Cta href="/projects" variant="paper">
              All projects
            </Cta>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:gap-y-24">
          {projects.map((p, i) => (
            <li key={p.slug} className={i % 2 ? "md:mt-24" : ""}>
              <ProjectCard p={p} i={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
