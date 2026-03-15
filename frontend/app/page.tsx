import LiveGlobe from "./components/LiveGlobe";

export default function HomePage() {
  return (
    <>
      <LiveGlobe />
      <div className="card">
        <h1>Живая карта города</h1>
        <p>
          Следи за персонажами, их планами на вечер и тем, что происходит в любимых
          местах города.
        </p>
        <p className="muted">
          Зарегистрируйся, заполни анкету и отметь свои места — мы покажем это на
          карте.
        </p>
      </div>
    </>
  );
}

