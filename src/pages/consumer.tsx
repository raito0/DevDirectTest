import styles from "@/styles/consumer.module.css";
import { Data, PropComponent, TypeComponent } from "@/types";
import Head from "next/head";
import { useEffect, useState } from "react";

function Consumer() {
  const [components, setComponents] = useState<Data[]>([]);
  useEffect(() => {
    // we will request data from api to here
    const data = localStorage.getItem("data") || "[]";
    const result = JSON.parse(data as string) as Data[];
    setComponents(result);
  }, []);

  return (
    <>
      <Head>
        <title>Consumer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.container}>
          {components.map((c) => {
            let outputComponent = <></>;
            switch (c.component) {
              case TypeComponent.PARAGRAPH:
                outputComponent = (
                  <p>
                    {(c.props as PropComponent<TypeComponent.PARAGRAPH>)?.text
                      ? (c.props as PropComponent<TypeComponent.PARAGRAPH>)
                          ?.text
                      : "Paragraph"}
                  </p>
                );
                break;
              case TypeComponent.BUTTON:
                outputComponent = (
                  <button
                    onClick={() => {
                      alert(c.props?.message);
                    }}
                  >
                    {(c.props as PropComponent<TypeComponent.BUTTON>)?.text
                      ? (c.props as PropComponent<TypeComponent.BUTTON>)?.text
                      : "Button"}
                  </button>
                );
                break;
              default:
                break;
            }

            return <div key={c._id}>{outputComponent}</div>;
          })}
        </div>
      </main>
    </>
  );
}

export default Consumer;
