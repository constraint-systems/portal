const Tips = () => {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        background: "white",
        color: "black",
        fontSize: 13,
        lineHeight: 1.2,
        paddingLeft: "0.5ch",
      }}
    >
      v - toggle outlines
      <br />
      hold c - make new instead of select
    </div>
  );
};

export default Tips;
