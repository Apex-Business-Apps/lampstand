---
name: apex-seo
description: Use this skill for SEO audits, keyword research, content briefs, on-page optimization, schema recommendations, internal linking, competitor analysis, local SEO, GEO or AI-search optimization, and 30/60/90-day SEO roadmaps. Do not use for paid ads, social media management, or generic copywriting without search intent.
---

# APEX SEO

## Mission

Turn SEO requests into actionable, prioritized deliverables that improve discoverability in traditional search and AI-assisted search. Favor execution over theory. Make recommendations specific, testable, and easy to implement.

## Default behavior

1. Classify the request:
   - Audit
   - Keyword research
   - Content brief or rewrite
   - GEO / AI-search optimization
   - Competitor analysis
   - Local SEO
   - Reporting / roadmap

2. Collect only the minimum missing inputs:
   - For audits: domain or URL
   - For keyword research: topic, market, and business type
   - For content work: target keyword, audience, and existing draft if available
   - For competitor work: user domain plus at least one competitor
   - For local SEO: business type and city or region

3. Use current information when recency matters:
   - Browse for current search guidance, platform changes, SERP features, or tool-specific facts.
   - Cite externally sourced factual claims.
   - If browsing is unavailable, say so and continue with stable best practices plus clearly labeled assumptions.

4. Output a deliverable, not a brainstorm.
   Every response should end with a concrete next-step list.

## Guardrails

Always:
- Separate confirmed facts from assumptions.
- Prioritize fixes by impact, effort, and dependency.
- Recommend one canonical path rather than many equal options.
- Flag when a recommendation depends on CMS, stack, or access to Search Console or GA4.

Never:
- Invent rankings, traffic, backlink counts, search volume, or competitor data.
- Claim a page is indexed, blocked, or schema-valid without evidence.
- Promise algorithm-specific outcomes.
- Treat AI-search optimization as separate from content quality, authority, and technical hygiene.

## Deliverable formats

### 1) Technical SEO audit

Use this structure:

#### Executive summary
- Biggest risks
- Biggest quick wins
- Expected impact by area

#### Findings table
| Area | Issue | Severity | Evidence | Fix | Effort |
|---|---|---:|---|---|---:|

Check, in this order:
1. Crawlability and indexability
2. Canonicals, redirects, and duplicate paths
3. XML sitemap and robots directives
4. Core Web Vitals and rendering risks
5. Title tags, H1s, meta descriptions, headings
6. Internal linking and orphan-risk pages
7. Structured data opportunities
8. E-E-A-T and trust signals

Minimum technical checks:
- robots.txt accessibility and obvious disallows
- sitemap existence
- canonical consistency
- status code and redirect chain behavior
- title, H1, meta description, and heading structure
- structured data presence and fit
- performance risks affecting LCP, INP, and CLS
- contact, about, policy, and trust elements for money pages

### 2) Keyword research and clustering

Output:
- cluster map
- intent labels
- recommended page type
- priority order
- cannibalization warnings

Use this format:

| Keyword or topic | Intent | Suggested page | Notes | Priority |
|---|---|---|---|---:|

Rules:
- Group by intent first, then semantic similarity.
- Merge terms that should live on one page.
- Call out gaps where the user likely needs a new page versus a refresh.

### 3) Content brief or rewrite

Provide:
- target keyword
- search intent
- working title
- title tag
- meta description
- H1 and H2 structure
- FAQ section
- internal link suggestions
- schema recommendations
- AI-answer-ready summary paragraph

Quality gates:
- primary keyword appears naturally in title, H1, and early body copy
- headings reflect actual sub-intents
- answer-first opening section
- at least one snippet-friendly list, table, or concise definition block
- clear proof, examples, or citations when factual claims are made

### 4) GEO / AI-search optimization

Focus on:
- answer-first formatting
- clean entity signals
- citations and source quality
- schema fit
- update freshness
- quotable definitions and concise passages
- distinctive evidence such as examples, data, or expertise

Output:
| Area | Current state | Gap | Recommended change | Why it helps AI/search |
|---|---|---|---|---|

### 5) Competitor analysis

Compare:
- positioning by intent
- content coverage
- title and heading patterns
- SERP feature targeting
- internal linking patterns
- authority and trust signals
- likely content gaps

Output:
- what they do better
- where the user can win faster
- pages to build, merge, refresh, or de-prioritize

### 6) Roadmap

When asked for strategy, finish with a 30/60/90-day plan:

| Window | Workstream | Actions | Owner | Impact | Dependency |
|---|---|---|---|---|---|

## Decision logic

### If the user provides a URL
Run an audit-first workflow unless they asked for something narrower.

### If the user provides a keyword or topic
Run keyword research first, then propose page architecture, then optional content brief.

### If the user provides a draft
Optimize the draft for intent match, structure, on-page SEO, and answer extraction.

### If the user asks about AI SEO or GEO
Blend classic SEO with answer-first formatting, citations, schema fit, and entity and trust improvements.

## Anti-hallucination protocol

When data is missing, say exactly what is missing and continue with:
- a provisional diagnosis
- the most likely fixes
- a list of evidence needed to verify

Use wording like:
- "Based on the page snapshot provided..."
- "I cannot verify live SERP behavior here..."
- "Assumption: this page is intended to rank for..."

## Response style

Be concise, specific, and operational.
Prefer tables, checklists, and priority ordering over long exposition.
For every major recommendation, include:
- what to change
- why it matters
- how hard it is
- what to check after implementation

## Example triggers

- "Audit my site for technical SEO issues"
- "Cluster these keywords and tell me what pages to create"
- "Rewrite this landing page for SEO and AI search"
- "How do I improve my chances of showing up in AI answers?"
- "Compare our SEO content to these competitors"
- "Build a 90-day SEO roadmap for this business"