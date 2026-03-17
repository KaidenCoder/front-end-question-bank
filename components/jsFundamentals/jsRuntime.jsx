import { useState, useRef } from "react";
import styles from "./jsRuntime.module.css";

export default function JsRuntimeComponent() {
  const [code, setCode] = useState(`
var a = 2;
let b = 3;

console.log("start");

setTimeout(()=>{
  console.log("timeout");
},0);

Promise.resolve().then(()=>{
  console.log("promise");
});
`);

  const [creation, setCreation] = useState([]);
  const [execution, setExecution] = useState([]);
  const [stack, setStack] = useState([]);
  const [micro, setMicro] = useState([]);
  const [macro, setMacro] = useState([]);
  const [webapi, setWebapi] = useState([]);
  const [eventStatus, setEventStatus] = useState("Idle");

  const timersRef = useRef([]);

  // Safe timeout
  const safeTimeout = (callback, delay) => {
    const id = setTimeout(() => {
      callback();
      timersRef.current = timersRef.current.filter((t) => t !== id);
    }, delay);

    timersRef.current.push(id);
  };

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // Stack helpers
  const pushStack = (item) => setStack((prev) => [item, ...prev]);
  const popStack = () => setStack((prev) => prev.slice(1));

  // Reset
  const reset = () => {
    setCreation([]);
    setExecution([]);
    setStack([]);
    setMicro([]);
    setMacro([]);
    setWebapi([]);
    setEventStatus("Idle");
  };

  // Simulate
  const simulate = () => {
    clearAllTimers();
    reset();

    pushStack("global()");
    parseCreationPhase(code);
    parseExecution(code);

    safeTimeout(() => {
      popStack();
      runEventLoop();
    }, 5000);
  };

  // Creation Phase (Hoisting)
  const parseCreationPhase = (code) => {
    const lines = code.split("\n");

    lines.forEach((line) => {
      if (line.includes("var ")) {
        const name = line.match(/var\s+(\w+)/)?.[1];
        if (name) {
          setCreation((p) => [...p, { name, value: "undefined", type: "var" }]);
        }
      }

      if (line.includes("let ") || line.includes("const ")) {
        const name = line.match(/(let|const)\s+(\w+)/)?.[2];
        if (name) {
          setCreation((p) => [
            ...p,
            { name, value: "<uninitialized>", type: "let" },
          ]);
        }
      }

      if (line.includes("function")) {
        const name = line.match(/function\s+(\w+)/)?.[1];
        if (name) {
          setCreation((p) => [
            ...p,
            { name, value: "function", type: "function" },
          ]);
        }
      }
    });
  };

  // Update variable value during execution
  const updateVariable = (name, value) => {
    setCreation((prev) =>
      prev.map((item) => (item.name === name ? { ...item, value } : item))
    );
  };

  // Execution Phase
  const parseExecution = (code) => {
    const lines = code.split("\n");
    let lastAsync = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      setExecution((p) => [...p, trimmed]);

      // Detect assignments
      if (trimmed.includes("=")) {
        const match = trimmed.match(/(var|let|const)?\s*(\w+)\s*=\s*(.+)/);

        if (match) {
          const variable = match[2];
          const value = match[3].replace(";", "").trim();

          safeTimeout(() => {
            updateVariable(variable, value);
          }, 5000);
        }
      }

      if (trimmed.includes("setTimeout")) {
        lastAsync = "timeout";
        setWebapi((p) => [...p, "setTimeout"]);
        return;
      }

      if (trimmed.includes("Promise")) {
        lastAsync = "promise";
        return;
      }

      if (trimmed.includes("console.log")) {
        const value = trimmed
          .match(/console\.log\((.*)\)/)?.[1]
          ?.replace(/['"`]/g, "");

        if (!lastAsync) {
          pushStack(`console.log → ${value}`);

          safeTimeout(() => {
            popStack();
          }, 5000);
        } else if (lastAsync === "promise") {
          setMicro((p) => [...p, `Promise → ${value}`]);
        } else if (lastAsync === "timeout") {
          safeTimeout(() => {
            setMacro((p) => [...p, `Timeout → ${value}`]);
          }, 5000);
        }

        lastAsync = null;
      }
    });
  };

  const runEventLoop = () => {
    setEventStatus("Running");

    const loop = () => {
      setMicro((microTasks) => {
        if (microTasks.length > 0) {
          const [task, ...rest] = microTasks;

          pushStack(task);

          safeTimeout(() => {
            popStack();
            loop();
          }, 5000);

          return rest;
        }

        setMacro((macroTasks) => {
          if (macroTasks.length > 0) {
            const [task, ...rest] = macroTasks;

            pushStack(task);

            safeTimeout(() => {
              popStack();
              loop();
            }, 5000);

            return rest;
          }

          setEventStatus("Idle");
          safeTimeout(loop, 5000);

          return macroTasks;
        });

        return microTasks;
      });
    };

    loop();
  };

  return (
    <div className={styles.runtimePage}>
  <h1>JavaScript Runtime Simulator</h1>

  <textarea
    className={styles.textarea}
    value={code}
    onChange={(e) => setCode(e.target.value)}
  />

  <button className={styles.button} onClick={simulate}>
    Simulate Code
  </button>

  <div className={styles.container}>
    <Box title="Creation Phase" data={creation} />
    <Box title="Execution Phase" data={execution} />
    <Box title="Call Stack" data={stack} />
    <Box title="Web APIs" data={webapi} />
    <Box title="Microtask Queue" data={micro} />
    <Box title="Macrotask Queue" data={macro} />
    <Box title="Event Loop" data={[eventStatus]} />
  </div>
</div>
  );
}

function Box({ title, data }) {
  return (
    <div className={styles.box}>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list}>
        {data.map((item, i) => (
          <li className={styles.item} key={i}>
            {typeof item === "string"
              ? item
              : `${item.name} → ${item.value}`}
          </li>
        ))}
      </ul>
    </div>
  );
}