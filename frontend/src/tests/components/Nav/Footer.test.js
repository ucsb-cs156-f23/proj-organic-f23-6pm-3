import { render, screen } from "@testing-library/react";
import Footer from "main/components/Nav/Footer";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

describe("Footer tests", () => {
    test("renders correctly", async () => {
        render(
            <Footer systemInfo={systemInfoFixtures.showingAll}/>
        );

        const expectedText = "Organic is a project of CS156, a course at UC Santa Barbara.  It's purpose: provide students and instructors with useful tools to manage Github organizations associated with programming and software engineering courses. The open source code is available on GitHub.";

        
        const text = screen.getByTestId("footer-content");
        expect(text).toBeInTheDocument();
        expect(typeof(text.textContent)).toBe('string');
        expect(text.textContent).toEqual(expectedText);
        
        const href = screen.getByTestId("github-href");
        expect(href).toHaveAttribute("href", "https://github.com/ucsb-cs156/proj-organic");
    });

    test("renders correctly when systemInfo.showingNeither", async () => {
        render(
            <Footer/>
        );

        const text = screen.getByTestId("footer-content");
        expect(text).toBeInTheDocument();
            
        const href = screen.getByTestId("github-href");
        expect(href.href).toBe("");
    });
});
