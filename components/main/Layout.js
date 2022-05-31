import Hero from "../three/Hero";
import Nav from "./Nav";

export default function Layout({ children }) {
  return (
    <div className="flex text-white">
      <style jsx global>
        {`
          body {
            margin: 0;
            padding: 0;
            font-size: 18px;
            font-weight: 400;
            line-height: 1.8;
            color: #333;
            font-family: sans-serif;
            background-color: black;
          }
          h1 {
            font-weight: 700;
          }
          p {
            margin-bottom: 10px;
          }
        `}
      </style>
      <Nav />
      <Hero />
      <main>{children}</main>
    </div>
  );
}
