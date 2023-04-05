import Input from "@/components/common/input";
import Draggable from "@/components/draggable";
import {
  selectComponents,
  updateAllData,
  updateData,
} from "@/store/component/slice";
import styles from "@/styles/admin.module.css";
import { Data, PropComponent, TypeComponent } from "@/types";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionCreators } from "redux-undo";

function Admin() {
  const refFile = useRef<HTMLInputElement | null>(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const components = useSelector(selectComponents);

  const handleSelectActiveComponent = useCallback(
    (id: string) => {
      const activeComponents = components.map((c) => {
        if (c._id === id) {
          return {
            ...c,
            isActived: true,
          };
        } else {
          return {
            ...c,
            isActived: false,
          };
        }
      });
      dispatch(updateAllData(activeComponents));
    },
    [components, dispatch]
  );

  const renderComponent = useMemo(() => {
    return (
      <div className={styles.rightContent}>
        {components.map((c) => {
          let outputComponent = <></>;
          switch (c.component) {
            case TypeComponent.PARAGRAPH:
              outputComponent = (
                <p>
                  {(c.props as PropComponent<TypeComponent.PARAGRAPH>)?.text
                    ? (c.props as PropComponent<TypeComponent.PARAGRAPH>)?.text
                    : "Paragraph"}
                </p>
              );
              break;
            case TypeComponent.BUTTON:
              outputComponent = (
                <button>
                  {(c.props as PropComponent<TypeComponent.BUTTON>)?.text
                    ? (c.props as PropComponent<TypeComponent.BUTTON>)?.text
                    : "Button"}
                </button>
              );
              break;
            default:
              break;
          }

          return (
            <div key={c._id} onClick={() => handleSelectActiveComponent(c._id)}>
              {outputComponent}
            </div>
          );
        })}
      </div>
    );
  }, [components, handleSelectActiveComponent]);

  const triggerSave = useCallback(
    (data: Data) => {
      dispatch(updateData(data));
    },
    [dispatch]
  );

  const renderRightBottom = useMemo(() => {
    const activeComponent = components.find((i) => i.isActived);
    if (!activeComponent) return;

    switch (activeComponent.component) {
      case TypeComponent.PARAGRAPH:
        return (
          <Input
            id="paragraph-text-id"
            label="Text"
            value={activeComponent.props?.text}
            onChange={(e) =>
              triggerSave({
                ...activeComponent,
                props: {
                  text: e.target.value,
                },
              })
            }
          />
        );
      case TypeComponent.BUTTON:
        return (
          <div>
            <Input
              id="button-text-id"
              label="Text"
              value={activeComponent.props?.text}
              onChange={(e) =>
                triggerSave({
                  ...activeComponent,
                  props: {
                    ...activeComponent.props,
                    text: e.target.value,
                  },
                })
              }
            />
            <Input
              id="button-message-id"
              label="Message"
              value={activeComponent.props?.message}
              onChange={(e) =>
                triggerSave({
                  ...activeComponent,
                  props: {
                    ...activeComponent.props,
                    message: e.target.value,
                  },
                })
              }
            />
          </div>
        );
      default:
        break;
    }
  }, [components, triggerSave]);

  // we will request API to store data instead
  const handleSave = () => {
    localStorage.setItem("data", JSON.stringify(components));
  };

  const handleUndo = () => {
    dispatch(ActionCreators.undo());
  };

  const handleRedo = () => {
    dispatch(ActionCreators.redo());
  };

  const handleExport = useCallback(() => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(components)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  }, [components]);

  const handleView = () => {
    router.push("/consumer");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const fr = new FileReader();
    fr.onload = function (e) {
      const result = JSON.parse(e.target?.result as string);
      dispatch(updateAllData(result));
    };

    fr.readAsText(files[0]);
  };

  const indexActive = components.findIndex((i) => !!i.isActived);
  const activeComponent = components.find((i) => !!i.isActived);

  const instance = indexActive === -1 ? "" : indexActive + 1;

  return (
    <>
      <Head>
        <title>Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <header>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className={styles.button} onClick={handleSave}>
              Save
            </button>
            <button className={styles.button} onClick={handleUndo}>
              Undo
            </button>
            <button className={styles.button} onClick={handleRedo}>
              Redo
            </button>
            <button className={styles.button} onClick={handleExport}>
              Export
            </button>
            <button
              className={styles.button}
              onClick={() => refFile.current?.click()}
            >
              Import
            </button>
            <button className={styles.button} onClick={handleView}>
              View
            </button>
            <input ref={refFile} type="file" hidden onChange={handleImport} />
          </div>
        </header>
        <section className={styles.container}>
          <div className={styles.left}>
            <Draggable
              title="Paragraph"
              typeComponent={TypeComponent.PARAGRAPH}
            />
            <Draggable title="Button" typeComponent={TypeComponent.BUTTON} />
          </div>
          <div className={styles.right} id="activated-zone">
            <div className={styles.rightTop}>
              <p>Instances: {instance}</p>
              <p>
                Config:{" "}
                {JSON.stringify({
                  component: activeComponent?.component,
                  props: activeComponent?.props,
                })}
              </p>
              {renderComponent}
            </div>
            <div className={styles.rightBottom}>{renderRightBottom}</div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Admin;
