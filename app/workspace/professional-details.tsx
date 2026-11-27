import { ArrowLeft, ChevronRight, X } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  formatYears,
  getPublishedDetail,
  relatedDetails,
  type EntityId,
} from "../content/professional-content";
import { WorkspaceDialog } from "./workspace-dialog";

const openDetails = createContext<
  ((id: EntityId, trigger: HTMLButtonElement) => void) | null
>(null);

type DetailSession = {
  id: EntityId;
  trigger: HTMLButtonElement;
  sequence: number;
};

export function ProfessionalDetails({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<DetailSession | null>(null);
  const active = useRef<DetailSession | null>(null);
  const sequence = useRef(0);
  return (
    <openDetails.Provider
      value={(id, trigger) => {
        const session = { id, trigger, sequence: ++sequence.current };
        active.current = session;
        setSelected(session);
      }}
    >
      {children}
      {selected && (
        <ProfessionalDialog
          key={selected.sequence}
          initial={selected.id}
          onClose={() => {
            // A native close event may arrive after a new detail was opened.
            if (active.current !== selected) return;
            active.current = null;
            setSelected(null);
            requestAnimationFrame(() => {
              if (sequence.current === selected.sequence)
                selected.trigger.focus({ preventScroll: true });
            });
          }}
        />
      )}
    </openDetails.Provider>
  );
}

export function DetailsButton({
  id,
  children,
}: {
  id: EntityId;
  children: ReactNode;
}) {
  const open = useContext(openDetails);
  return (
    <button
      className="detail-link"
      type="button"
      aria-haspopup="dialog"
      disabled={!open}
      onClick={(event) => open?.(id, event.currentTarget)}
    >
      {children}
      <ChevronRight size={14} aria-hidden="true" />
    </button>
  );
}

function ProfessionalDialog({
  initial,
  onClose,
}: {
  initial: EntityId;
  onClose: () => void;
}) {
  const [path, setPath] = useState([initial]);
  const current = path.at(-1);
  const detail = current && getPublishedDetail(current, "fr");
  const heading = useRef<HTMLHeadingElement>(null);
  const titleId = useId();

  useEffect(() => {
    heading.current?.closest("dialog")?.scrollTo({ top: 0 });
    heading.current?.focus({ preventScroll: true });
  }, [current]);

  if (!detail) return null;
  const { entity, copy } = detail;
  const related = relatedDetails(entity, "fr");
  return (
    <WorkspaceDialog
      className="professional-dialog"
      titleId={titleId}
      onClose={onClose}
    >
      <header>
        {path.length > 1 && (
          <button
            type="button"
            className="icon-button outlined"
            aria-label="Fiche précédente"
            onClick={() => setPath((previous) => previous.slice(0, -1))}
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <form method="dialog">
          <button
            type="submit"
            className="icon-button outlined"
            aria-label="Fermer la fiche"
          >
            <X size={19} />
          </button>
        </form>
      </header>
      <h2 ref={heading} id={titleId} tabIndex={-1}>
        {copy.title}
      </h2>
      {entity.kind === "experience" && (
        <dl className="professional-terms">
          <dt>Poste</dt>
          <dd>{entity.role.fr}</dd>
          <dt>Période</dt>
          <dd>{formatYears(entity.period, "fr")}</dd>
          {entity.contract && (
            <>
              <dt>Contrat</dt>
              <dd>{entity.contract.fr}</dd>
            </>
          )}
        </dl>
      )}
      {entity.kind === "education" && entity.period && (
        <dl className="professional-terms">
          {entity.institution && (
            <>
              <dt>Organisme</dt>
              <dd>{entity.institution.fr}</dd>
            </>
          )}
          <dt>Période</dt>
          <dd>{formatYears(entity.period, "fr")}</dd>
        </dl>
      )}
      {copy.paragraphs?.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {entity.kind === "availability" && (
        <dl className="professional-terms">
          <dt>Contrats</dt>
          <dd>{entity.terms.fr.contracts.join(" · ")}</dd>
          <dt>Périmètre</dt>
          <dd>{entity.terms.fr.regions.join(" · ")}</dd>
          <dt>Modalités</dt>
          <dd>{entity.terms.fr.modes.join(" · ")}</dd>
          <dt>Postes ciblés</dt>
          <dd>{entity.terms.fr.targets.join(" · ")}</dd>
        </dl>
      )}
      {copy.sections?.map(({ title, items }) => (
        <section className="professional-section" key={title}>
          <h3>{title}</h3>
          <ul>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
      {entity.kind === "experience" && entity.technologies.length > 0 && (
        <section className="professional-section">
          <h3>Technologies utilisées</h3>
          <ul className="stack">
            {entity.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </section>
      )}
      {related.length > 0 && (
        <nav aria-label="Fiches liées">
          <h3>Fiches liées</h3>
          <ul>
            {related.map(({ entity, copy }) => (
              <li key={entity.id}>
                <button
                  className="detail-link"
                  type="button"
                  onClick={() =>
                    setPath((previous) => [...previous, entity.id])
                  }
                >
                  {copy.title}
                  <ChevronRight size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </WorkspaceDialog>
  );
}
