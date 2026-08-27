# Correction: useNavigate ReferenceError on MarketingPage

## Date: 2026-06-19
## Status: Resolved

## Symptom
Landing page threw `ReferenceError: useNavigate is not defined` inside the React ErrorBoundary.

## Root Cause
An accidental refactoring edit stripped `import React from "react";` and `import { Link, useNavigate } from "react-router-dom";` from `MarketingPage.tsx`.

## Fix
Restored React and React Router imports.

## Regression Shield
Created `src/pages/MarketingPage.test.tsx` mounting `MarketingPage` with full Router contexts.
