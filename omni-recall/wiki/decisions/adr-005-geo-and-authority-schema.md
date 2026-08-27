# ADR-005: Generative Engine Optimization & Entity Schema Graph

## Status: Accepted

## Context
AI search engines (Google AI Overviews, Perplexity, ChatGPT Search) require structured JSON-LD and crawler permissions to accurately cite sources.

## Decision
Implement a multi-entity Schema.org `@graph` (`WebSite`, `Organization`, `WebApplication`, `BreadcrumbList`, `HowTo`, `FAQPage`) and explicit crawler permissions in `robots.txt` without injecting client-side tracking scripts.

## Consequences
Achieves top-tier AI search citation authority while maintaining 100% user privacy.
