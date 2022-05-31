import React from "react";

export default function Nav() {
  return (
    <header
      style={{
        borderBottom: "1px solid white",
      }}
      className="fixed top-0 flex flex-row  w-full justify-between text-center border-b-2  p-2  "
    >
      <div className="logo uppercase">Ayad-AlShaikhli</div>
      <div className="hidden md:flex time  justify-between text-md">
        <h1 className="pr-5">Sao Paulo 03:15 AM</h1>
        <h1>London 03:15 AM</h1>
      </div>
      <div className="summary">Summary</div>
    </header>
  );
}
