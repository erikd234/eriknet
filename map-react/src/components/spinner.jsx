const loaderStyles = {
  position: "absolute",
  top: "calc(50% - 40px)",
  left: "calc(50% - 40px)",
  border: "10px solid #3a2a1a",
  borderTop: "10px solid #c8a850",
  borderRadius: "50%",
  width: "80px",
  height: "80px",
  animation: "spin 1s linear infinite",
};

const textStyles = {
  position: "absolute",
  top: "calc(50% + 50px)",
  left: "50%",
  transform: "translateX(-50%)",
  fontFamily: "'MedievalSharp', serif",
  fontSize: "14px",
  color: "#c8a850",
  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
};

const Spinner = () => (
  <>
    <div style={loaderStyles}></div>
    <div style={textStyles}>Loading quest scroll...</div>
  </>
);

export default Spinner;
