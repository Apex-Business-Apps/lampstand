import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChartStyle } from "../components/ui/chart";

describe("ChartStyle Security", () => {
  it("should not allow XSS through id", () => {
    const maliciousId = '"><script>alert("xss-id")</script>';
    const config = {
      test: { color: "red" },
    };

    const { container } = render(<ChartStyle id={maliciousId} config={config} />);

    const styleTag = container.querySelector("style");
    expect(styleTag).toBeTruthy();
    const content = styleTag?.innerHTML || "";

    // Should be escaped as \3c and \22 etc.
    expect(content).not.toContain('"><script>');
    expect(content).toContain('\\22 \\3e \\3c script\\3e ');
  });

  it("should handle bypass scenarios like </style >", () => {
    const maliciousId = '</style ><script>alert("xss-bypass")</script>';
    const config = {
      test: { color: "red" },
    };

    const { container } = render(<ChartStyle id={maliciousId} config={config} />);

    const styleTag = container.querySelector("style");
    expect(styleTag).toBeTruthy();
    const content = styleTag?.innerHTML || "";

    expect(content).not.toContain("</style >");
    expect(content).toContain("\\3c /style \\3e \\3c script\\3e ");
  });

  it("should preserve functionality for dots and colons in keys", () => {
    const dataKey = "revenue.total:monthly";
    const config = {
      [dataKey]: { color: "blue" },
    };

    const { container } = render(<ChartStyle id="test-chart" config={config} />);

    const styleTag = container.querySelector("style");
    const content = styleTag?.innerHTML || "";

    // revenue.total:monthly should be escaped but still functional for CSS
    expect(content).toContain("--color-revenue\\2e total\\3a monthly");
  });

  it("should not allow XSS through color values", () => {
    const maliciousColor = 'red; } </style><script>alert("xss-color")</script>';
    const config = {
      test: { color: maliciousColor },
    };

    const { container } = render(<ChartStyle id="test-chart" config={config} />);

    const styleTag = container.querySelector("style");
    expect(styleTag).toBeTruthy();
    const content = styleTag?.innerHTML || "";

    expect(content).not.toContain("</style><script>");
    // spaces are not escaped in the current implementation
    expect(content).toContain("red\\3b  \\7d  \\3c /style\\3e \\3c script\\3e ");
  });
});
