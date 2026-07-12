## Plan: Live Pages Import Readiness

Add a safe "Initialize Draft from Live Pages" flow so configurator can start from existing site pages (`index.html`/`contact.html`/`privacy.html`), preserve mobile vs desktop state, and avoid recreating HOME each session.

**Steps**
1. Phase A - Import Contract and Scope Lock
2. Define importer input/output contract in `tools/configurator/import/live-importer.js`: source pages, extracted fields, confidence flags, and unresolved fields list. This blocks all later implementation.
3. Define merge precedence policy: imported values overwrite matching desktop/page-scoped fields; existing draft values remain for unextractable fields (especially mobile-only and complex content blocks).
4. Define user-triggered flow in configurator UI as explicit action (not automatic): "Initialize Draft from Live Pages" with status report.

5. Phase B - Import Module and Bridge Foundation
6. Create `tools/configurator/import/import-bridge.js` for pure parsing helpers:
7. HTML text extraction for HOME/CONTACT/PRIVACY key content.
8. CSS variable parsing for theme/size values from generated root styles.
9. Transform parsing for x/y layout coordinates.
10. Page-mode mapping helpers and import report builder.
11. Create `tools/configurator/import/live-importer.js` orchestration:
12. read page HTML through fetch under localhost,
13. run page-specific extractors,
14. produce partial state payload + diagnostics.
15. Ensure all parser helpers are deterministic and side-effect free for testability.

16. Phase C - Runtime Integration in Configurator
17. Add new action wiring in `js/configurator.app.js`: button handler for live import and status output.
18. Add action control in `tools/configurator/index.html` near draft tools.
19. Integrate importer result into existing merge/sanitize pipeline already used by draft import:
20. merge with `tools/configurator/core/state-bridge.js` normalizers,
21. preserve existing mobile override fields if importer cannot infer them,
22. preserve existing tab/gallery/contact detailed structures when not reliably extracted.
23. Reuse existing refresh/render pipeline so desktop and mobile previews update immediately after import.

24. Phase D - Page Coverage and Mobile/Desktop Safety
25. HOME import coverage:
26. brand name, hero text, visible button labels/links (when present), key colors/font, layout transforms, logo sources.
27. CONTACT import coverage:
28. title/intro/submit label/endpoint when present in markup.
29. PRIVACY import coverage:
30. title/intro/main policy text sections when present.
31. Mobile/desktop handling:
32. import desktop layout from published HOME transform anchors,
33. keep existing mobile layout fields by default,
34. optionally infer mobile fields only when explicit mobile CSS vars are present.
35. Add clear diagnostics for fields not inferred, so user understands what was preserved vs imported.

36. Phase E - Unit Testing and Stabilization
37. Add unit tests in `tests/unit/import-bridge.test.js`:
38. css var parsing,
39. transform parsing,
40. color/size normalization handoff,
41. report generation and missing-field diagnostics.
42. Add unit tests in `tests/unit/live-importer.test.js`:
43. page fetch sequencing,
44. partial import behavior,
45. merge precedence (imported desktop/page fields override, non-extractable fields preserved),
46. mobile-preservation assertions.
47. Add integration tests in `tests/integration/live-page-import.test.js`:
48. import from `index.html`, `contact.html`, `privacy.html`,
49. merge behavior keeps existing non-extractable fields,
50. desktop import does not clobber mobile overrides,
51. partial-page failures degrade gracefully.
52. Extend `tests/integration/environment-support.test.js` assertions for page-scoped consistency after import.
53. Add test gate in implementation checklist: no merge until all new unit tests pass in CI/local run.

54. Phase F - Documentation and Ready-to-Edit Workflow
55. Update `docs/configurator-operations.md` with a new section "Initialize from Live Pages":
56. prerequisites (localhost),
57. one-time bootstrap flow from current live pages,
58. ongoing cycle (edit -> save repo draft -> publish),
59. limitations list for non-recoverable fields.
60. Add a dedicated "Unit Testing" subsection in `docs/configurator-operations.md`:
61. test file locations under `tests/unit` and `tests/integration`,
62. commands (`npm test`, `npm run test:watch`),
63. expected importer unit-test matrix,
64. what failures mean and how to triage parser vs merge-policy failures.
65. Add troubleshooting notes for malformed/missing page markup and fallback behavior.

**Relevant files**
- `tools/configurator/index.html` - add import action entry in UI.
- `js/configurator.app.js` - wire import handler and state merge integration.
- `tools/configurator/import/import-bridge.js` - new pure parsing helpers.
- `tools/configurator/import/live-importer.js` - new import orchestration flow.
- `tools/configurator/core/state-bridge.js` - reuse/extend normalization utilities for parsed values.
- `tests/unit/import-bridge.test.js` - parser and diagnostics unit tests.
- `tests/unit/live-importer.test.js` - importer orchestration and merge-policy unit tests.
- `tests/integration/live-page-import.test.js` - end-to-end import behavior tests.
- `tests/integration/environment-support.test.js` - verify scope isolation after import.
- `index.html` - live HOME source for import.
- `contact.html` - live CONTACT source for import.
- `privacy.html` - live PRIVACY source for import.
- `docs/configurator-operations.md` - operator workflow and limitations.

**Verification**
1. Run unit and integration suite with `npm test`; all existing and new tests pass.
2. Ensure importer unit tests explicitly pass for parser helpers and merge-policy rules.
3. Manual scenario: start with existing draft, run live import, confirm HOME visually matches current `index.html` baseline.
4. Manual scenario: switch preview to mobile and confirm mobile overrides remain stable unless explicitly imported.
5. Manual scenario: import with one page missing/broken and verify partial import + clear status diagnostics.
6. Manual scenario: publish after import and verify generated pages still pass current publish flow expectations.
7. Documentation check: `docs/configurator-operations.md` includes the new Unit Testing subsection with commands and triage guidance.

**Decisions**
- Included: import bootstrap from real pages for HOME/CONTACT/PRIVACY and preservation-first merge policy.
- Included: mobile-safe behavior by default (do not overwrite mobile override fields unless confidently inferable).
- Excluded: full reverse-engineering of every generated detail (tabs/gallery/form schema) from static HTML when unreliable.
- Excluded: silent background import; user must trigger import explicitly.

**Further Considerations**
1. Add optional "import confidence" summary modal so users can accept/reject specific field groups.
2. Add snapshot backup of pre-import draft in memory/localStorage for one-click rollback.
3. Add a strict mode later that fails import unless all required HOME anchors are present.
