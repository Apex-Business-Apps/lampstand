## 2024-05-24 - [Tabnabbing vulnerability on target="_blank" links]
**Vulnerability:** External links using `target="_blank"` without `rel="noopener"` (only `noreferrer` was present).
**Learning:** React handles `target="_blank"` without `rel="noreferrer noopener"` securely by default in newer versions but it's best practice to explicitly add `noopener noreferrer`. Also helps avoid older browser tabnabbing attacks.
**Prevention:** Always use `rel="noopener noreferrer"` with `target="_blank"`.
