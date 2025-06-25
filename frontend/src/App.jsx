import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, error, loading };
};

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-7xl font-bebas-neue text-slate-800">Loading..</div>
    </div>
  );
};

const GridHeroes = ({ heroes, pick }) => {
  const sortedHeroes = heroes.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="grid grid-cols-7 gap-6 place-items-center max-h-[23rem] pb-10 font-league-gothic text-2xl overflow-y-scroll no-scrollbar">
      {sortedHeroes.map((value) => (
        <div key={value.name} className="flex flex-col items-center">
          <img
            src={`${"/" + value.icon}`}
            className="w-16 h-16 cursor-pointer"
            onClick={() => pick(value.name)}
          />
          <div className="">{value.name}</div>
        </div>
      ))}
    </div>
  );
};

const MidSection = ({ predict, result, setResult, setDatapick }) => {
  const handleReset = () => {
    setResult({});
    setDatapick({ blue: [], red: [] });
  };

  return (
    <>
      <div className="absolute left-1/2 transform -translate-x-1/2 top-14 z-10 flex flex-col justify-center items-center">
        {Object.keys(result).length === 0 && !result.error ? (
          <div className="font-bebas-neue text-white text-6xl mb-5">VS</div>
        ) : (
          <button
            className="relative z-10 w-14 h-14 p-2 flex justify-center bg-slate-800 text-gray-300 rounded-full hover:text-gray-200 active:text-gray-50 focus:outline-none"
            onClick={handleReset}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="currentColor"
                d="M386.3 160L336 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"
              />
            </svg>
          </button>
        )}
      </div>

      {Object.keys(result).length > 0 && !result.error && (
        <div className="absolute left-1/2 transform -translate-x-1/2 z-10 bottom-22 flex flex-col justify-center items-center">
          <div className="flex gap-7 font-bebas-neue text-slate-900 text-2xl">
            <span>{result.blue_chance}%</span>
            <span>{result.red_chance}%</span>
          </div>
        </div>
      )}

      <div className="absolute z-10 bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          className="relative z-10 w-14 h-14 p-3 flex justify-center bg-slate-800 rounded-full text-gray-300 hover:text-gray-200 active:text-gray-50 focus:outline-none cursor-pointer"
          id="Brain"
          onClick={predict}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-7 h-7"
          >
            <path
              fill="currentColor"
              d="M184 0c30.9 0 56 25.1 56 56l0 400c0 30.9-25.1 56-56 56c-28.9 0-52.7-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56l0-400c0-30.9 25.1-56 56-56z"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

const RoleSection = ({ active, setActive }) => {
  const roles = ["Tank", "Fighter", "Assassin", "Mage", "Marksman", "Support"];

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center gap-3 flex-1 font-league-gothic text-3xl text-center select-none">
      {roles.map((role, index) => (
        <div
          key={index}
          className={`${
            active === role ? "bg-gray-900" : "bg-gray-600"
          } text-gray-50 w-36 py-1 cursor-pointer uppercase`}
          onClick={() => setActive(active === role ? "" : role)}
        >
          {role}
        </div>
      ))}
    </div>
  );
};

const LaneSection = ({ active, setActive }) => {
  const lanes = ["Exp Lane", "Jungle", "Mid Lane", "Gold Lane", "Roam"];

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center gap-3 flex-1 font-league-gothic text-3xl text-center select-none">
      {lanes.map((lane, index) => (
        <div
          key={index}
          className={`${
            active === lane ? "bg-gray-900" : "bg-gray-600"
          } text-gray-50 w-36 py-1 cursor-pointer uppercase`}
          onClick={() => setActive(active === lane ? "" : lane)}
        >
          {lane}
        </div>
      ))}
    </div>
  );
};

const TeamSection = ({
  color,
  pickedHeroes,
  side,
  removeHero,
  win,
  positions,
  heroes,
}) => {
  return (
    <div
      className={`${side === win || win === "" ? color : "bg-gray-700"}`}
      side={side}
    >
      <div
        className={`grid grid-cols-5 justify-start font-bebas-neue text-2xl text-[#fdfdfd] text-center ${
          side === "blue" ? "pr-20" : "pl-20"
        }`}
      >
        {positions.map((value, index) => {
          const hero = pickedHeroes[index];
          const heroData = hero ? heroes.find((h) => h.name === hero) : null;

          return (
            <div
              key={`${value.name + side}`}
              side-data={`${value.name + "-" + side}`}
              onClick={() => removeHero(side, index)}
              className="cursor-pointer"
            >
              <div className="w-full h-[182px] bg-gray-900 flex justify-center items-center">
                {heroData ? (
                  <img
                    src={`${"/" + heroData.portrait}`}
                    className="w-full h-auto"
                  />
                ) : (
                  <img src={`${"/" + value.icon}`} className="w-20 h-20" />
                )}
              </div>
              <div
                className={`py-2 ${
                  side === win || win === ""
                    ? "text-slate-900"
                    : "text-slate-300"
                }`}
              >
                {heroData ? heroData.name : value.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const App = () => {
  const [datapick, setDatapick] = useState({ blue: [], red: [] });
  const [filter, setFilter] = useState("lane");
  const [activeRole, setActiveRole] = useState("");
  const [activeLane, setActiveLane] = useState("");
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [result, setResult] = useState({});

  const flaskUrl = import.meta.env.VITE_FLASK_URL;

  const { data: heroes, loading: loadingHero } = useFetch(
    "/data/heroes_detail_1.9.72.json"
  );
  const { data: positions, loading: loadingPosition } = useFetch(
    "/data/heroes_position.json"
  );

  const isLoading = loadingHero || loadingPosition;

  useEffect(() => {
    if (!heroes) return;

    let filtered = heroes;

    if (filter === "lane" && activeLane) {
      filtered = filtered.filter((hero) => hero.lanes.includes(activeLane));
    } else if (filter === "role" && activeRole) {
      filtered = filtered.filter((hero) => hero.roles.includes(activeRole));
    }

    setFilteredHeroes(filtered);
  }, [heroes, filter, activeLane, activeRole]);

  const onclickHeroIcon = (name) => {
    setDatapick((prevDatapick) => {
      // Check if the hero is already in either team
      if (prevDatapick.blue.includes(name) || prevDatapick.red.includes(name)) {
        return prevDatapick;
      }

      // Find the first null position in the blue team
      const blueTeam = [...prevDatapick.blue];
      const blueIndex = blueTeam.indexOf(null);
      if (blueIndex !== -1) {
        blueTeam[blueIndex] = name;
      } else if (blueTeam.length < 5) {
        blueTeam.push(name);
      } else {
        // If blue team is full, add to red team
        const redTeam = [...prevDatapick.red];
        const redIndex = redTeam.indexOf(null);
        if (redIndex !== -1) {
          redTeam[redIndex] = name;
        } else if (redTeam.length < 5) {
          redTeam.push(name);
        }
        return { blue: blueTeam, red: redTeam };
      }

      return { blue: blueTeam, red: prevDatapick.red };
    });
  };

  const removeHero = (side, index) => {
    setDatapick((prevDatapick) => {
      const newTeam = [...prevDatapick[side]];
      newTeam[index] = null; // Ganti elemen yang dihapus dengan null

      const newDatapick = { ...prevDatapick, [side]: newTeam };

      // Reset data jika semua hero dihapus
      if (newDatapick[side].every((hero) => hero === null)) {
        newDatapick[side] = [];
      }

      // Reset data jika semua hero di kedua tim dihapus
      if (
        newDatapick.blue.every((hero) => hero === null) &&
        newDatapick.red.every((hero) => hero === null)
      ) {
        return { blue: [], red: [] };
      }

      return newDatapick;
    });
  };

  const predict = async () => {
    // Ensure both teams have 5 valid heroes
    const { blue, red } = datapick;
    if (
      blue.length !== 5 ||
      red.length !== 5 ||
      blue.includes(null) ||
      red.includes(null)
    ) {
      return;
    }

    // Prepare data_picks using array destructuring
    const [
      blue_explaner,
      blue_jungler,
      blue_midlaner,
      blue_goldlaner,
      blue_roamer,
    ] = blue;
    const [red_explaner, red_jungler, red_midlaner, red_goldlaner, red_roamer] =
      red;

    const data_picks = {
      blue_explaner: [blue_explaner],
      blue_jungler: [blue_jungler],
      blue_midlaner: [blue_midlaner],
      blue_goldlaner: [blue_goldlaner],
      blue_roamer: [blue_roamer],
      red_explaner: [red_explaner],
      red_jungler: [red_jungler],
      red_midlaner: [red_midlaner],
      red_goldlaner: [red_goldlaner],
      red_roamer: [red_roamer],
    };

    // Gather hero attributes
    const dataHero = [...blue, ...red];
    const attributes = dataHero.map((heroName) =>
      heroes.find((h) => h.name === heroName)
    );

    const attribute = {
      hero: attributes.map((h) => h?.name ?? ""),
      durability: attributes.map((h) => h?.durability ?? 0),
      offense: attributes.map((h) => h?.offense ?? 0),
      control_effects: attributes.map((h) => h?.control_effects ?? 0),
      difficulty: attributes.map((h) => h?.difficulty ?? 0),
      early: attributes.map((h) => h?.early ?? 0),
      mid: attributes.map((h) => h?.mid ?? 0),
      late: attributes.map((h) => h?.late ?? 0),
    };

    try {
      const response = await fetch(`${flaskUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data_picks, attributes: attribute }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const resultData = await response.json();
      setResult(resultData);
    } catch (err) {
      console.log(err.message);

      setResult({ error: err.message });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center min-h-screen bg-slate-950">
      <div className="max-w-7xl max-h-screen w-full h-full bg-[#fdfdfd] overflow-y-hidden">
        <div className="relative">
          <div
            id="team-section"
            className="grid grid-cols-2 relative z-10 pointer-events-auto"
          >
            <TeamSection
              side={"blue"}
              color={"bg-[#39B5FF]"}
              pickedHeroes={datapick.blue}
              removeHero={removeHero}
              win={result.prediction ?? ""}
              positions={positions}
              heroes={heroes}
            />
            <TeamSection
              side={"red"}
              color={"bg-[#FF5958]"}
              pickedHeroes={datapick.red}
              removeHero={removeHero}
              win={result.prediction ?? ""}
              positions={positions}
              heroes={heroes}
            />
          </div>
          <MidSection
            predict={predict}
            result={result}
            setResult={setResult}
            setDatapick={setDatapick}
          />
        </div>
        <div className="max-w-6xl mx-auto relative flex items-center justify-end py-3">
          {filter === "role" ? (
            <RoleSection active={activeRole} setActive={setActiveRole} />
          ) : filter === "lane" ? (
            <LaneSection active={activeLane} setActive={setActiveLane} />
          ) : (
            <></>
          )}
          <div
            onClick={() =>
              setFilter((prev) => (prev === "role" ? "lane" : "role"))
            }
            className="flex items-center justify-center gap-2 bg-gray-600 text-gray-50 py-1 px-3 cursor-pointer uppercase font-league-gothic text-3xl text-center select-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
              />
            </svg>
            <span>{filter === "role" ? "Role" : "Lane"}</span>
          </div>
        </div>
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="h-[23rem] pb-3">
            <GridHeroes heroes={filteredHeroes} pick={onclickHeroIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
