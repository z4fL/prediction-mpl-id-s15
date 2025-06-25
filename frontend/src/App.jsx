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
    <div className="grid grid-cols-7 gap-3 lg:gap-6 place-items-center lg:max-h-[23rem] pb-20 overflow-y-scroll no-scrollbar">
      {sortedHeroes.map((value) => (
        <div key={value.name} className="flex flex-col items-center">
          <img
            src={`${"/" + value.icon}`}
            className="w-10 lg:w-16 h-10 lg:h-16 cursor-pointer"
            onClick={() => pick(value.name)}
            loading="lazy"
          />
          <div className="font-league-gothic text-base lg:text-2xl text-nowrap">{value.name}</div>
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
      <div className="absolute left-1/2 transform -translate-x-1/2 top-10 z-10 flex flex-col justify-center items-center">
        {Object.keys(result).length === 0 && !result.error ? (
          <div className="font-bebas-neue text-white text-6xl mb-5">VS</div>
        ) : (
          <button
            className="relative z-10 w-14 h-14 p-3 flex justify-center bg-slate-800 rounded-full text-gray-300 hover:text-gray-200 active:text-gray-50 focus:outline-none"
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
          <div className="flex gap-10 font-bebas-neue text-slate-50 text-2xl">
            <span>{result.blue_chance}%</span>
            <span>{result.red_chance}%</span>
          </div>
        </div>
      )}

      <div className="absolute z-10 bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          className="relative z-10 px-4 py-1.5 flex justify-center bg-slate-800 font-bebas-neue text-3xl text-gray-100 hover:text-gray-300 active:text-gray-50 focus:outline-none cursor-pointer"
          id="Brain"
          onClick={predict}
        >
          Prediction
        </button>
      </div>
    </>
  );
};

const FilterSection = ({ type, active, setActive }) => {
  const options =
    type === "role"
      ? ["Tank", "Fighter", "Assassin", "Mage", "Marksman", "Support"]
      : ["Exp Lane", "Jungle", "Mid Lane", "Gold Lane", "Roam"];

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center gap-1 lg:gap-3 flex-1 select-none">
      {options.map((option, index) => (
        <div
          key={index}
          className={`${
            active === option ? "bg-gray-900" : "bg-gray-600"
          } font-league-gothic text-base lg:text-3xl text-center text-gray-50 min-w-14 lg:w-36 py-0.5 px-1 cursor-pointer uppercase text-nowrap`}
          onClick={() => setActive(active === option ? "" : option)}
        >
          {option}
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
          side === "blue" ? "pr-24" : "pl-24"
        }`}
      >
        {positions.map((position, index) => {
          const hero = pickedHeroes[index];
          const heroData = hero ? heroes.find((h) => h.name === hero) : null;

          return (
            <div
              key={`${position.name + side}`}
              side-data={`${position.name + "-" + side}`}
              onClick={() => removeHero(side, index)}
              className="cursor-pointer"
            >
              <div className="relative w-full h-[176px] bg-gray-900 flex justify-center items-center">
                {heroData && (
                  <div className="absolute">
                    <img
                      src={`${"/" + heroData.portrait}`}
                      className="w-full h-auto"
                    />
                    <img
                      src={`${"/" + position.icon}`}
                      className="absolute top-1.5 left-1.5 w-8 h-8 opacity-80"
                      style={{ zIndex: 2 }}
                    />
                  </div>
                )}
                <img src={`${"/" + position.icon}`} className="w-20 h-20" />
              </div>
              <div
                className={`py-2 ${
                  side === win || win === ""
                    ? "text-slate-900"
                    : "text-slate-200"
                }`}
              >
                {heroData ? heroData.name : position.name}
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
    <div className="relative lg:flex justify-center min-h-screen bg-slate-950">
      <div class="hidden portrait:flex flex-col fixed inset-0 z-50 bg-slate-900 font-inter text-white text-center items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
          />
        </svg>

        <p class="text-lg px-6">
          Putar HP kamu ke <span class="font-bold">mode landscape</span> yaa 😎
        </p>
      </div>
      <div className="portrait:hidden relative lg:max-w-7xl lg:max-h-screen w-full h-full bg-[#fdfdfd]">
        <div className="hidden lg:block relative">
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
        <div className="lg:hidden fixed z-10 w-full flex justify-between">
          <div className="flex flex-col">
            <div className="">
              <img src="public/images/87/portrait.png" alt="miya" className="w-28 h-16 object-cover object-top" />
            </div>
            <div className="">
              <img src="public/images/21/portrait.png" alt="miya" className="w-28 h-16 object-cover object-top" />
            </div>
            <div className="">
              <img src="public/images/101/portrait.png" alt="miya" className="w-28 h-16 object-cover object-[0%_35%]" />
            </div>
            <div className="">
              <img src="public/images/79/portrait.png" alt="miya" className="w-28 h-16 object-cover object-[0%_15%]" />
            </div>
            <div className="">
              <img src="public/images/41/portrait.png" alt="miya" className="w-28 h-16 object-cover object-[0%_20%]" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="">
              <img src="public/images/87/portrait.png" alt="miya" className="w-28 h-16 object-cover object-top" />
            </div>
            <div className="">
              <img src="public/images/21/portrait.png" alt="miya" className="w-28 h-16 object-cover object-top" />
            </div>
            <div className="">
              <img src="public/images/101/portrait.png" alt="miya" className="w-28 h-16 object-cover object-[0%_35%]" />
            </div>
            <div className="">
              <img src="public/images/79/portrait.png" alt="miya" className="w-28 h-16 object-cover object-[0%_15%]" />
            </div>
            <div className="">
              <img src="public/images/41/portrait.png" alt="miya" className="w-28 h-16 object-cover object-[0%_20%]" />
            </div>
          </div>
        </div>
        <div className="bg-[#fdfdfd] h-12 max-w-[440px] lg:max-w-6xl mx-auto fixed top-0 inset-x-0 z-30 flex items-center">
          {filter === "role" ? (
            <FilterSection
              type="role"
              active={activeRole}
              setActive={setActiveRole}
            />
          ) : filter === "lane" ? (
            <FilterSection
              type="lane"
              active={activeLane}
              setActive={setActiveLane}
            />
          ) : (
            <></>
          )}
          <div
            onClick={() =>
              setFilter((prev) => (prev === "role" ? "lane" : "role"))
            }
            className="absolute -right-5 flex items-center justify-center gap-1 bg-gray-600 text-gray-50 py-0.5 px-1 lg:px-3 cursor-pointer uppercase font-league-gothic text-base lg:text-3xl text-center select-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4"
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
        <div className="relative pt-12.5 z-20 w-full max-w-md lg:max-w-4xl mx-auto lg:h-[23rem] lg:pb-3">
          <GridHeroes heroes={filteredHeroes} pick={onclickHeroIcon} />
        </div>
      </div>
    </div>
  );
};

export default App;
