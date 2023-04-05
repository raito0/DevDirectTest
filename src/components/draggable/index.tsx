import { addData } from "@/store/component/slice";
import { TypeComponent } from "@/types";
import { PropsWithChildren, useState } from "react";
import {
  DraggableData,
  DraggableEvent,
  default as DraggableLibrary,
} from "react-draggable";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import styles from "./draggable.module.css";

interface IDraggable {
  title: string;
  typeComponent: TypeComponent;
}

const Draggable: React.FC<PropsWithChildren<IDraggable>> = ({
  title,
  typeComponent,
}) => {
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    e.preventDefault();
    e.stopPropagation();

    const bodyRect = document
      .getElementById("activated-zone")
      ?.getBoundingClientRect();
    const offsetWidthBox = data.node.offsetWidth;

    // when user drag to actived area
    if (offsetWidthBox / 2 + data.x > (bodyRect?.x || 0)) {
      dispatch(
        addData({
          _id: uuidv4(),
          component: typeComponent,
        })
      );
    }
    setPosition({ x: 0, y: 0 });
  };

  return (
    <DraggableLibrary onStop={handleStop} bounds="body" position={position}>
      <div className={styles.block}>
        <div className={styles.box} />
        <p>{title}</p>
      </div>
    </DraggableLibrary>
  );
};

export default Draggable;
