## Plan: Configurator Relocation and Modular Execution

Move configurator into tools/configurator, separate web server into tools/webserver, centralize all test code under tests, add operations documentation, and preserve full desktop + mobile feature parity with dedicated mobile module boundaries.

**Steps**
1. Phase 0 - Scope Lock and Baseline Mapping
2. Freeze feature inventory from current configurator runtime and HTML controls (Home, Privacy, Contact, publish scopes, draft flows, preview modes, drag interactions). *blocks all later steps*
3. Define target directory contract before any move:
4. `tools/configurator` for configurator source and UI modules.
5. `tools/configurator/mobile` for mobile-specific manageable modules.
6. `tools/webserver` for local mini server.
7. `tests` for all unit/integration/fixtures/util test helpers.
8. `docs/configurator-operations.md` for operator guide. *depends on 2*

9. Phase 1 - Test Platform First (under tests)
10. Initialize test runner and place all test files under `tests` only, including unit tests, integration tests, fixtures, and mocks. *depends on 8*
11. Build baseline regression tests for currently supported behaviors without changing logic:
12. Desktop preview render paths.
13. Mobile preview render paths.
14. Page mode switching (home/privacy/contact).
15. Publish matrix (`home`, `privacy`, `contact`, `all`).
16. Draft flows (export/import/save repo/load repo).
17. Pointer drag interactions for desktop and mobile positions.
18. Enforce rule that no production tests live outside `tests`. *depends on 10*

19. Phase 2 - Relocate Configurator to tools/configurator
20. Move configurator entry HTML and JS orchestration into `tools/configurator` while preserving behavior through compatibility aliases/loader stubs if needed. *depends on 18*
21. Establish module layout inside `tools/configurator`:
22. `core` for state, migrations, shared utilities.
23. `settings` for Colors, Fonts, Button Titles, Logos.
24. `editors` for content/layout/tabs/contact-fields.
25. `publish` for publish/save/restore services.
26. `render` for preview/builders.
27. `mobile` for mobile-specific UI and logic segmentation.
28. Keep existing runtime-compatible outputs so generated pages still work with existing page runtimes. *depends on 20*

29. Phase 3 - Dedicated Publish/Save/Restore Isolation
30. Extract publish/save/restore into isolated services under `tools/configurator/publish` and `tools/configurator/draft`. *depends on 28*
31. Keep button/action contracts stable from existing UI wiring during migration.
32. Add low-level tests in `tests` for:
33. asset staging and naming,
34. file-system handle persistence,
35. fallback download paths,
36. publish scope correctness,
37. logo backfill behavior.
38. Include desktop and mobile preview state compatibility checks before publish generation. *depends on 30*

39. Phase 4 - Split Manageable Settings Sections
40. Implement separate settings modules for Colors, Fonts, Button Titles, Logos under `tools/configurator/settings`. *depends on 38*
41. Bind settings application to currently active page context (home/privacy/contact) so changes apply to active page only.
42. Add explicit page-context indicator in configurator UI and immutable guardrails preventing cross-page accidental writes.
43. Add integration tests in `tests` that verify isolation across page modes on both desktop and mobile preview contexts. *depends on 41*

44. Phase 5 - Mobile-First Manageable Segmentation
45. Create `tools/configurator/mobile` with focused modules for mobile layout overrides, mobile preview behavior, mobile drag mapping, and mobile typography overrides. *depends on 43*
46. Keep desktop logic outside mobile folder to simplify debugging ownership boundaries.
47. Add dedicated test suites in `tests` for mobile-only behaviors and desktop-vs-mobile parity comparisons.
48. Validate that mobile overrides affect only mobile rendering and never regress desktop outputs. *depends on 45*

49. Phase 6 - Mini Local Web Server in tools/webserver
50. Implement local static server under `tools/webserver` with localhost launch, MIME handling, and development caching strategy. *parallel with 47*
51. Add run scripts and health checks ensuring configurator can be tested on localhost before publishing.
52. Add test hooks or scripted checks (kept under `tests`) validating server availability and configurator boot success on desktop and mobile viewport emulation. *depends on 50*

53. Phase 7 - Documentation and Operator Runbook
54. Create `docs/configurator-operations.md` with full how-to for:
55. launching local server,
56. opening configurator,
57. using separated settings pages,
58. switching page edit mode,
59. mobile vs desktop testing,
60. publish/save/restore flows,
61. troubleshooting folder picker and fallback downloads,
62. running test suite from `tests`.
63. Include debugging map that points each responsibility to its module folder. *depends on 52*

64. Phase 8 - Final Parity, Cleanup, and Release Gate
65. Remove obsolete monolithic paths only after all parity tests pass.
66. Run full regression matrix for desktop + mobile across all currently supported functions.
67. Verify directory-policy compliance:
68. configurator code under `tools/configurator`.
69. mobile-manageable code under `tools/configurator/mobile`.
70. server code under `tools/webserver`.
71. all tests under `tests`.
72. operational documentation under `docs/configurator-operations.md`.
73. Prepare rollback snapshot and migration notes before merge. *depends on 66*

**Relevant files and target paths**
- `tools/configurator/` - new configurator home (entry, modules, services).
- `tools/configurator/mobile/` - mobile-manageable modules and overrides.
- `tools/webserver/` - mini local web server implementation.
- `tests/` - all unit/integration/system tests, fixtures, mocks, helper utilities.
- `docs/configurator-operations.md` - operator documentation for end-to-end usage.
- `configurator.html` - source reference for legacy feature mapping and migration compatibility.
- `js/configurator.app.js` - source reference for extraction sequence.

**Verification**
1. Unit tests in `tests` cover state, normalization, publish payload, draft serialization, and mobile override mapping.
2. Integration tests in `tests` validate desktop and mobile interactions for all current supported features.
3. Publish matrix validation confirms all four scopes function and fallback behavior is unchanged.
4. Directory contract validation confirms code/tests/server/docs are in required paths.
5. Manual parity checklist confirms visual and behavioral consistency across desktop and mobile previews.
6. Backward compatibility checks confirm existing drafts still load and publish output remains valid.

**Decisions**
- Included: strict folder relocation policy, mobile-specific module boundary, centralized tests directory, dedicated server folder, operations documentation.
- Excluded: feature redesign unrelated to manageability goals, schema-breaking draft format changes.
- Migration style: incremental extraction with compatibility checkpoints at each phase.

**Further Considerations**
1. Add CI rule to fail if tests are added outside `tests`.
2. Add lint/import rule to enforce no cross-import from desktop modules into `tools/configurator/mobile` unless through shared core interfaces.
3. Add release checklist item requiring desktop+mobile parity sign-off before publish tooling changes are merged.
