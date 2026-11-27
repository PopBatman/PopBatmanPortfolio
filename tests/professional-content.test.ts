import { describe, expect, it } from "vitest";
import {
  AVAILABILITY_ID,
  PROFILE_ID,
  approvedCopy,
  getPublishedDetail,
  professionalContent,
  profile,
  relatedDetails,
  validateContent,
  type Entity,
} from "../app/content/professional-content";

describe("professional content", () => {
  it("validates the versioned catalog and resolves approved French references", () => {
    expect(professionalContent.version).toBe(1);
    expect(validateContent(professionalContent)).toEqual([]);
    expect(
      relatedDetails(profile, "fr").map(({ entity }) => entity.kind),
    ).toEqual([
      "expertise",
      "expertise",
      "expertise",
      "expertise",
      "availability",
    ]);
    expect(getPublishedDetail(AVAILABILITY_ID, "fr")?.entity.related).toEqual([
      PROFILE_ID,
    ]);
  });

  it("keeps unauthorised translations and drafts out of published details", () => {
    const draft: Entity = {
      ...profile,
      copy: { ...profile.copy, en: { title: "Draft", status: "draft" } },
    };
    expect(approvedCopy(draft, "en")).toBeUndefined();
    expect(approvedCopy({ ...profile, status: "draft" }, "fr")).toBeUndefined();
    expect(getPublishedDetail(PROFILE_ID, "en")).toBeUndefined();
    expect(relatedDetails(profile, "en")).toEqual([]);
  });

  it("reports duplicate ids, dangling references and references to unpublished entities", () => {
    const draft: Entity<"technology"> = {
      kind: "technology",
      category: "backend",
      usage: "current",
      id: "technology:review-pending",
      status: "draft",
      related: [],
      copy: { fr: { title: "À relire", status: "draft" } },
    };
    const broken = {
      ...profile,
      related: [draft.id, "project:absent"],
    } satisfies Entity;
    const errors = validateContent({
      version: 1,
      entities: [profile, broken, draft],
    });
    expect(errors).toContain("Identifiant dupliqué : profile:positionnement");
    expect(errors).toContain(
      "Référence invalide : profile:positionnement → technology:review-pending",
    );
    expect(errors).toContain(
      "Référence invalide : profile:positionnement → project:absent",
    );
  });

  it("rejects publication without approved French copy or a valid local PDF", () => {
    const document: Entity<"document"> = {
      id: "document:cv",
      kind: "document",
      status: "approved",
      language: "fr",
      variant: "general",
      path: "//example.invalid/cv.pdf",
      copy: { fr: { title: "CV", status: "draft" } },
      related: [],
    };
    expect(validateContent({ version: 1, entities: [document] })).toEqual([
      "Version française non approuvée : document:cv",
      "PDF local requis : document:cv",
    ]);
  });
});
