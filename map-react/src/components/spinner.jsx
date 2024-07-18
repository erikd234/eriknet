const loaderStyles = {
  position: "absolute",
  top: "calc(50% - 40px)",
  left: "calc(50% - 40px)",
  border: "10px solid #f3f3f3",
  borderTop: "10px solid #3498db",
  borderRadius: "50%",
  width: "80px",
  height: "80px",
  animation: "spin 1s linear infinite",
};

const Spinner = () => <div style={loaderStyles}></div>;

export default Spinner;
