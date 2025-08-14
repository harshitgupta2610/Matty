import { Excalidraw } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";

const App = () => {
  return (
    <div className="app-container">
      <h1>Excalidraw Canvas</h1>
      <div className="excalidraw-wrapper">
        <Excalidraw />
      </div>
    </div>
  );
};

export default App;
