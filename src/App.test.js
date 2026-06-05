import { render } from "@testing-library/react";

import App from "./App.jsx";

jest.mock(
  "react-router-dom",
  () => ({
    BrowserRouter: ({ children }) => children,
    Routes: ({ children }) => children,
    Route: () => null,
    Navigate: () => null,
  }),
  { virtual: true },
);

test("renders the app shell without crashing", () => {
  const { container } = render(<App />);
  expect(container).toBeTruthy();
});
