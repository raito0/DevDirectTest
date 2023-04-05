interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input: React.FC<IInput> = ({ label, id, ...rest }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor={id}>{label}</label>
      <input {...rest} id={id} />
    </div>
  );
};

export default Input;
