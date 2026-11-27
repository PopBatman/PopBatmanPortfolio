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
  getPublishedDetail,
  relatedDetails,
  type EntityId,
} from "../content/professional-content";
import { WorkspaceDialog } from "./workspace-dialog";

const openDetails = createContext<
  ((id: EntityId, trigger: HTMLButtonElement) => void) | null
>(null);

export function ProfessionalDetails({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<EntityId | null>(null);
  const origin = useRef<HTMLButtonElement | null>(null);
  return (
    <openDetails.Provider
      value={(id, trigger) => {
        origin.current = trigger;
        setSelected(id);
      }}
    >
      {children}
      {selected && (
        <ProfessionalDialog
          initial={selected}
          onClose={() => {
            setSelected(null);
            requestAnimationFrame(() =>
              origin.current?.focus({ preventScroll: true }),
            );
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
