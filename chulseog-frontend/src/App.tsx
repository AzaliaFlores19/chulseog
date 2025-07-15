import { Alert, Button } from "@heroui/react";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";

function App() {
  return (
    <>
      <HeroUIProvider>
        <div>
          <Button color="danger">Peligro</Button>
          <Alert title="Chulseog" description="Welcome" />
          <h1 className="font-extrabold text-red-500 text-2xl">asd</h1>
        </div>
      </HeroUIProvider>
    </>
  );
}

export default App;
