import { Container } from "react-bootstrap";

export default function Footer({systemInfo}) {
  return (
    <footer className="bg-light pt-3 pt-md-4 pb-4 pb-md-5">
      <Container>
        <p data-testid="footer-content">
          Organic is a project of{' '} 
          <a href="https://ucsb-cs156.github.io">CS156</a>, 
          a course at UC Santa Barbara.  It's purpose: provide students and instructors with useful tools to manage
          Github organizations associated with programming and software engineering courses.
          The open source code is available on
          <> </>
          <a data-testid="github-href" href={systemInfo?.sourceRepo}>GitHub</a>. 
        </p>
      </Container>
    </footer>
  );
}