# CLAUDE.md — Code Generation Rules

# Language (MUST FOLLOW)

- MUST respond to the user in **Vietnamese** for all explanations, summaries, questions, and chat replies.
- Code, identifiers, file paths, commands, log messages, commit messages, and technical keywords stay in their original language (English/code).
- Comments inside code: keep existing language style of the file; do not translate existing comments.
- Error messages quoted from logs/tools: keep the original text, then explain in Vietnamese.

# Behavior Rules (MUST FOLLOW)

## Execution Enforcement

You are NOT allowed to write code immediately.

You MUST:
1. Ask clarification questions if needed
2. Restate the problem and scope
3. Propose a solution approach
ONLY after explicit user confirmation → you can write code.

FORBIDDEN: write code without user confirmation

## Thinking Process

### 1. Clarify Before Coding
- DO NOT assume requirements
- Ask questions if anything is unclear
- Confirm scope before implementation

### 2. Simplicity First
- Prefer the simplest solution that works
- Avoid unnecessary abstraction (service, repository, interface)
- Only introduce complexity if justified

Project-Specific:
- DO NOT create Service layer if logic is simple CRUD
- DO NOT create Repository unless needed for abstraction/testing
- Prefer inline logic for simple flows
- Reuse existing patterns (do NOT invent new ones)

### 3. Surgical Changes Only
- Modify ONLY the minimum required code
- DO NOT refactor unrelated parts
- Preserve existing architecture unless explicitly asked

### 4. Define Success Before Coding
- Clearly define what "done" means
- Include expected outputs or test cases if possible

### 5. Think in System Context
- Consider: Queues, Transactions, Idempotency, Side effects
- ALWAYS consider impact on existing flows

## When You MUST NOT Write Code

DO NOT write code if requirements are unclear, multiple interpretations exist, scope is not confirmed, or changes may affect database schema / queue / external services.
Also stop if GitNexus shows HIGH or CRITICAL impact.

→ STOP and ask the user.

## Required Response Format (BEFORE CODING)

1. **Understanding** — restate the problem in your own words
2. **Questions** — list all unclear points
3. **Proposed Approach** — high-level solution (NO code)
4. **Scope Confirmation** — what WILL / will NOT be changed

WAIT for user confirmation before coding.
FORBIDDEN: write code before user confirms scope.
DO NOT perform deep analysis before scope confirmation. Only provide high-level understanding.

## Mandatory Instructions

Before generating any code, MUST read and comply with ALL files in:
- `docs/dev-manual/agent-instructions/`

## Architecture References

- `docs/architecture/` — Architecture docs, DDD rules, system flows
- `docs/dev-manual/security/` — Security checklists, monitoring, controls
- `docs/database/` — Raw database schemas (SQL)
- `docs/dev-manual/agent-instructions/rules/` — AI rule system (detailed rules by category)

## Developer Documentation

- `docs/dev-manual/README.md` — Main entry point, reading path for new developers
- `docs/dev-manual/00-onboarding/` — System overview, environment, git, devctl
- `docs/dev-manual/02-database/` — YugabyteDB, MongoDB, ClickHouse
- `docs/dev-manual/03-backend/` — Shared libraries, proto, i18n, environment
- `docs/dev-manual/04-testing/` — Testing guide and slash commands
- `docs/dev-manual/05-reference/` — Naming conventions, API comparison
- `docs/dev-manual/06-frontend/` — React/NextJS: tenant context, multi-org patterns

## superpowers:writing-plans — Project Extensions (MANDATORY)

Rules below apply ON TOP OF the `superpowers:writing-plans` skill.

**1. Plan frontmatter** — every plan MUST start with:
```yaml
---
title: <Feature Name>
status: Đã lập kế hoạch
created_date: YYYY-MM-DD
started_date:
completed_date:
cancel_reason:
owner: <ai/người chịu trách nhiệm>
related_spec: <đường dẫn spec nếu có>
---
```
Update as plan progresses. Valid status: `Đã lập kế hoạch` / `Đang triển khai` / `Đang test` / `Hoàn thành` / `Hủy` (tiếng Việt, đúng 5 giá trị, hủy phải có cancel_reason).

**2. Sync to shared docs** — `docs/superpowers/plans/` is gitignored; `docs/plans/` is committed (team-visible).
- After creating plan → ask: *"Sync sang `docs/plans/<filename>.md` để team thấy không? [y/n]"*
- When plan reaches `Hoàn thành` or `Hủy` → ask: *"Sync trạng thái cuối sang `docs/plans/` không? [y/n]"*

## Git workflow (MANDATORY)

- MUST use: `git pull` (merge strategy)
- FORBIDDEN: `git pull --rebase`, `git rebase` (shared branches)

## Slash Commands

| Namespace | Commands |
|-----------|----------|
| `/code:` | gen-domain, gen-proto, gen-repository, gen-service, gen-handler, gen-client, gen-export-excel, gen-import-excel |
| `/api:` | gen-api-spec |
| `/database:` | gen-schema, gen-database-doc, gen-migration, update-database-doc |
| `/test:` | gen-unit, gen-integration, gen-e2e, gen-system, gen-connectivity, run |
| `/standardize:` | domain, repository, service, handler, proto |
| `/doc:` | add-rule, add-task, add-workflow |
| `/workflow:` | gen-feature, standardize-entity, gen-test-suite |
| `/issue:` | resolve, update |
| `/report:` | gen-stats-api |

- `/test:e2e-frontend <app> <feature>` — Skill: `docs/dev-manual/agent-instructions/skills/e2e-test.md`
- `/report:gen-stats-api` — Skill: `docs/dev-manual/agent-instructions/skills/gen-stats-api.md`
- `/code:add-file-view-download-api <service>` — Skill: `docs/dev-manual/agent-instructions/skills/add-file-view-download-api.md`

<!-- gitnexus:start -->
<!-- gitnexus:end -->
