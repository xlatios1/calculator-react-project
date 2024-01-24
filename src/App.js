import "./App.css";
import { useState, useEffect } from "react";

export default function App() {
  const [result, setResult] = useState("0");
  const [allow, setAllow] = useState(false); //allow to add 0
  const [dec, setDec] = useState(true); //allow to add .
  const [oneTime, setOneTime] = useState(false); //allow 0 after operations
  const [allowOperations, setAllowOperations] = useState(true); //allow to add operations
  const operations = ["/", "x", "-", "+"];
  const inputs = [".", ...Array(10).keys()].toReversed();

  const reini = () => {
    setAllow(false);
    setDec(true);
    setOneTime(false);
    setAllowOperations(true);
  };

  const handleClick = (e) => {
    const value = e.target.value;

    setResult((prev) => {
      let last = prev;
      let lastL = String(prev[prev.length - 1]);

      if (["Infinity", "NaN"].includes(result)) {
        last = "0";
        lastL = "0";
        reini();
      }

      if (value === "0") {
        // 0
        if (dec && allow) {
          if (oneTime) {
            setAllow(false);
            setOneTime(false);
          }
          last = last + value;
        } else if (allow) {
          last = last + value;
        }
        setAllowOperations(true);
      } else if (value === ".") {
        // .
        if (dec) {
          console.log("HI");
          if (operations.includes(lastL)) {
            console.log("HEY");
            last = last + "0";
          }
          last = last + value;
        }
        setDec(false);
        setAllow(true);
        setAllowOperations(false);
      } else if (operations.includes(value)) {
        // + - / x
        if (allowOperations) {
          setDec(true);
          setAllow(true);
          setOneTime(true);
          setAllowOperations(false);
          last = last + value;
        } else if (operations.includes(lastL)) {
          last = last.substring(0, last.length - 1) + value;
        }
      } else {
        // 1-9
        setAllow(true);
        setAllowOperations(true);
        if (lastL === "0" && !allow) {
          last = last.substring(0, last.length - 1) + value;
        } else {
          last = last + value;
        }
      }
      return last;
    });
  };

  const handleEqual = () => {
    let total = 0.0;
    let results = [];
    let temp = "";
    let res = result;
    const reint = /[0-9]|[.]/;

    if (operations.includes(res[res.length - 1])) {
      res += 0;
    }

    for (let i = 0; i < res.length; i++) {
      if (reint.test(res[i])) {
        temp = temp + res[i];
      } else {
        if (i === 0) {
          temp = temp + res[i];
        } else {
          results.push(parseFloat(temp));
          results.push(res[i]);
          temp = "";
        }
      }
    }
    if (temp) results.push(parseFloat(temp));
    console.log(results);

    const optFn = (a, b, opt) => {
      console.log("opt", a, b, opt, "-" === opt);

      if (opt === "-") {
        return a - b;
      } else if (opt === "+") {
        return a + b;
      } else if (opt === "/") {
        return a / b;
      } else if (opt === "x") {
        return a * b;
      } else {
        console.log("????");
      }
    };

    let afterpriority = [];
    for (let i = 0; i < results.length; i++) {
      let temp = results[i];
      switch (typeof temp) {
        case "number":
          afterpriority.push(temp);
          break;
        case "string":
          if (["+", "-"].includes(temp)) {
            afterpriority.push(temp);
          } else {
            afterpriority.push(optFn(afterpriority.pop(), results[++i], temp));
          }
          break;
        default:
          console.log("???");
      }
    }
    console.log("afterpriorit", afterpriority);

    let ans = "";
    afterpriority.map((i) => (ans += i));

    console.log("RESULTS:", eval(ans), ans);
    reini();
    setResult(String(eval(ans)));
  };

  return (
    <div className="calculator-wrapper">
      <div className="display-wrapper">
        <div className="display-result">{result}</div>
      </div>
      <div className="input-wrapper">
        <div className="number-pad">
          {[0, 3, 6, 9].map((x, i) => (
            <div key={x + i} className={`number row-${i}`}>
              {[0, 1, 2].map((y) => {
                if (x + y < inputs.length)
                  return (
                    <button
                      key={x + y}
                      className={`number item-${String(inputs[x + y])}`}
                      onClick={handleClick}
                      value={inputs[x + y]}
                    >
                      {inputs[x + y]}
                    </button>
                  );
              })}
            </div>
          ))}
        </div>
        <div className="simple-fn-pad">
          {operations.map((x) => (
            <button
              key={x}
              className={`function keys-${x}`}
              onClick={handleClick}
              value={x}
            >
              {x}
            </button>
          ))}
        </div>
      </div>
      <div className="equal-wrapper">
        <button
          key={"="}
          className="equal-fn"
          value={"="}
          onClick={handleEqual}
        >
          =
        </button>
      </div>
    </div>
  );
}
