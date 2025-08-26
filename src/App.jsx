import React, { useState, useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaLock, FaUnlock } from "react-icons/fa";
import { api } from "./core/api";
import { useUpdate } from "./hooks/use-update";

function App() {
  const [submitting, setSubmitting] = useState(false);
  const [edit, setEdit] = useState(false);
  const [admin, setAdmin] = useState(false);

  const [playerSpec, setPlayerSpec] = useState({
    name: "",
    rating: 1000,
    firstDate: false,
    secondDate: false,
    thirdDate: false,
    fourthDate: false,
  });

  const [editSpec, setEditSpec] = useState({
    id: 0,
    name: "",
    rating: 1000,
    firstDate: false,
    secondDate: false,
    thirdDate: false,
    fourthDate: false,
  });

  const { data, refetch } = useUpdate("/applications");

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
    };
    fetchData();
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayerSpec((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleAdmin = () => {
    const password = window.prompt("Zadejte administrátorské heslo:");
    if (password === "admin105629") {
      setAdmin(true);
    } else alert("Špatné heslo!");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditSpec((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const changeToEditMode = (player) => {
    setEdit(true);
    setEditSpec({
      id: player.id,
      name: player.name,
      rating: player.rating,
      firstDate: player.firstDate,
      secondDate: player.secondDate,
      thirdDate: player.thirdDate,
      fourthDate: player.fourthDate,
    });
  };

  const editPlayer = async () => {
    setSubmitting(true);
    const patchReqPayload = {
      name: editSpec.name,
      rating: Number(editSpec.rating),
      firstDate: editSpec.firstDate === "true" || editSpec.firstDate === true ? true : false,
      secondDate: editSpec.secondDate === "true" || editSpec.secondDate === true ? true : false,
      thirdDate: editSpec.thirdDate === "true" || editSpec.thirdDate === true ? true : false,
      fourthDate: editSpec.fourthDate === "true" || editSpec.fourthDate === true ? true : false,
    };

    await api
      .patch(`/applications/${editSpec.id}`, patchReqPayload)
      .then(async () => {
        await refetch();
        alert("Přihláška byla úspěšně upravena ✅");
      })
      .catch((err) => {
        console.log(`Patch req - ${err}`);
        alert(
          "Něco se pokazilo, omlouváme se. Pravděpodobně je potřeba obnovit databázi, informujte prosím organizátory 😕"
        );
      });

    setSubmitting(false);
    setEdit(false);
    setEditSpec({
      id: 0,
      name: "",
      rating: 1000,
      firstDate: false,
      secondDate: false,
      thirdDate: false,
      fourthDate: false,
    });
  };

  const addPlayer = async () => {
    setSubmitting(true);
    const postReqPayload = {
      name: playerSpec.name,
      rating: Number(playerSpec.rating),
      firstDate: playerSpec.firstDate === "true" ? true : false,
      secondDate: playerSpec.secondDate === "true" ? true : false,
      thirdDate: playerSpec.thirdDate === "true" ? true : false,
      fourthDate: playerSpec.fourthDate === "true" ? true : false,
    };

    await api
      .post("/applications", postReqPayload)
      .then(async () => {
        await refetch();
        alert("Přihláška byla úspěšně odeslána ✅");
      })
      .catch((err) => {
        console.log(`Post req - ${err}`);
        alert(
          "Něco se pokazilo, omlouváme se. Pravděpodobně je potřeba obnovit databázi, informujte prosím organizátory 😕"
        );
      });

    setSubmitting(false);
    setPlayerSpec({
      name: "",
      rating: 1000,
      firstDate: false,
      secondDate: false,
      thirdDate: false,
      fourthDate: false,
    });
  };

  const deletePlayer = async (id) => {
    if (window.confirm("Opravdu chcete smazat tohoto hráče?")) {
      await api
        .delete(`/applications/${id}`)
        .then(async () => {
          await refetch();
          alert("Hráč byl úspěšně smazán ✅");
        })
        .catch((err) => {
          console.log(`Delete req - ${err}`);
          alert("Něco se pokazilo, omlouváme se 😕");
        });
    }
  };

  const firstTermPlayers = data?.filter((player) => player.firstDate);
  const secondTermPlayers = data?.filter((player) => player.secondDate);
  const thirdTermPlayers = data?.filter((player) => player.thirdDate);
  const fourthTermPlayers = data?.filter((player) => player.fourthDate);

  const validForm =
    playerSpec.name &&
    playerSpec.rating >= 1000 &&
    playerSpec.rating <= 2500 &&
    (playerSpec.firstDate ||
      playerSpec.secondDate ||
      playerSpec.thirdDate ||
      playerSpec.fourthDate);

  const validEditForm =
    editSpec.name &&
    editSpec.rating >= 1000 &&
    editSpec.rating <= 2500 &&
    (editSpec.firstDate || editSpec.secondDate || editSpec.thirdDate || editSpec.fourthDate);

  return (
    <div className="bg-black text-white min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center [&>*]:my-10">
        {admin ? (
          <FaLock className="hover:cursor-pointer" onClick={() => setAdmin(false)} />
        ) : (
          <FaUnlock className="hover:cursor-pointer" onClick={toggleAdmin} />
        )}
        {edit && (
          <div className="fixed flex justify-center items-center top-0 left-0 z-50 w-full h-full bg-black/95">
            <div className="border border-white rounded-md p-10 flex flex-col [&>*]:my-3 shadow-lg shadow-white">
              <h1 className="self-center font-bold text-[3rem]">Editace</h1>
              <div className="flex flex-col text-[1.6rem] [&>*]:my-3">
                <div className="flex items-center">
                  <label htmlFor="name" className="min-w-[10rem]">
                    Jméno:
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="bg-transparent border border-white/50 shadow-md shadow-white/50 rounded-md p-2"
                    value={editSpec.name}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="flex items-center">
                  <label htmlFor="rating" className="min-w-[10rem]">
                    ELO rating:
                  </label>
                  <input
                    id="rating"
                    name="rating"
                    type="number"
                    className="bg-transparent border border-white/50 shadow-md shadow-white/50 rounded-md p-2"
                    min={1000}
                    max={2500}
                    value={editSpec.rating}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="flex items-center">
                  <label htmlFor="firstDate" className="min-w-[10rem]">
                    7/9/2025:
                  </label>
                  <select
                    name="firstDate"
                    id="firstDate"
                    className="bg-white text-black border border-white/50 shadow-md shadow-white/50 rounded-md p-2"
                    value={editSpec.firstDate}
                    onChange={handleEditChange}>
                    <option value={false}>Ne</option>
                    <option value={true}>Ano</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label htmlFor="secondDate" className="min-w-[10rem]">
                    14/9/2025:
                  </label>
                  <select
                    name="secondDate"
                    id="secondDate"
                    className="bg-white text-black border border-white/50 shadow-md shadow-white/50 rounded-md p-2"
                    value={editSpec.secondDate}
                    onChange={handleEditChange}>
                    <option value={false}>Ne</option>
                    <option value={true}>Ano</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label htmlFor="thirdDate" className="min-w-[10rem]">
                    21/9/2025:
                  </label>
                  <select
                    name="thirdDate"
                    id="thirdDate"
                    className="bg-white text-black border border-white/50 shadow-md shadow-white/50 rounded-md p-2"
                    value={editSpec.thirdDate}
                    onChange={handleEditChange}>
                    <option value={false}>Ne</option>
                    <option value={true}>Ano</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label htmlFor="fourthDate" className="min-w-[10rem]">
                    28/9/2025:
                  </label>
                  <select
                    name="fourthDate"
                    id="fourthDate"
                    className="bg-white text-black border border-white/50 shadow-md shadow-white/50 rounded-md p-2"
                    value={editSpec.fourthDate}
                    onChange={handleEditChange}>
                    <option value={false}>Ne</option>
                    <option value={true}>Ano</option>
                  </select>
                </div>
                <div className="flex self-center items-center [&>*]:mx-5">
                  <button
                    className={`border border-white p-5 bg-transparent rounded-md self-center hover:bg-white hover:text-black shadow-md shadow-white ${
                      (!validEditForm || submitting) && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={editPlayer}
                    disabled={!validEditForm || submitting}>
                    {submitting ? "Úprava..." : "Upravit"}
                  </button>
                  <button
                    className="border border-white p-5 bg-transparent rounded-md self-center hover:bg-white hover:text-black shadow-md shadow-white"
                    onClick={() => setEdit(false)}>
                    Zpět
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="border border-white rounded-md p-10 flex flex-col [&>*]:my-3 shadow-lg shadow-white">
          <h1 className="font-bold text-[3rem]">Chrudimské září - přihláška</h1>
          <div className="flex flex-col text-[1.6rem] [&>*]:my-3">
            <div className="flex items-center">
              <label htmlFor="name" className="min-w-[10rem]">
                Jméno:
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="bg-transparent border border-white/50 shadow-md shadow-white/50 rounded-md p-2"
                value={playerSpec.name}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="rating" className="min-w-[10rem]">
                ELO rating:
              </label>
              <input
                id="rating"
                name="rating"
                type="number"
                className="bg-transparent border border-white/50 shadow-md shadow-white/50 rounded-md p-2"
                min={1000}
                max={2500}
                value={playerSpec.rating}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="firstDate" className="min-w-[10rem]">
                7/9/2025:
              </label>
              <select
                name="firstDate"
                id="firstDate"
                className="bg-white text-black border border-white/50 shadow-md shadow-white/50 rounded-md p-2"
                value={playerSpec.firstDate}
                onChange={handleChange}>
                <option value={false}>Ne</option>
                <option value={true}>Ano</option>
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="secondDate" className="min-w-[10rem]">
                14/9/2025:
              </label>
              <select
                name="secondDate"
                id="secondDate"
                className="bg-white text-black border border-white/50 shadow-md shadow-white/50 rounded-md p-2"
                value={playerSpec.secondDate}
                onChange={handleChange}>
                <option value={false}>Ne</option>
                <option value={true}>Ano</option>
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="thirdDate" className="min-w-[10rem]">
                21/9/2025:
              </label>
              <select
                name="thirdDate"
                id="thirdDate"
                className="bg-white text-black border border-white/50 shadow-md shadow-white/50 rounded-md p-2"
                value={playerSpec.thirdDate}
                onChange={handleChange}>
                <option value={false}>Ne</option>
                <option value={true}>Ano</option>
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="fourthDate" className="min-w-[10rem]">
                28/9/2025:
              </label>
              <select
                name="fourthDate"
                id="fourthDate"
                className="bg-white text-black border border-white/50 shadow-md shadow-white/50 rounded-md p-2"
                value={playerSpec.fourthDate}
                onChange={handleChange}>
                <option value={false}>Ne</option>
                <option value={true}>Ano</option>
              </select>
            </div>
            <button
              className={`border border-white p-5 bg-transparent rounded-md self-center hover:bg-white hover:text-black shadow-md shadow-white ${
                (!validForm || submitting) && "opacity-50 cursor-not-allowed"
              }`}
              onClick={addPlayer}
              disabled={!validForm || submitting}>
              {submitting ? "Přihlášování..." : "Přihlásit se"}
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center border border-white p-10 rounded-md shadow-lg shadow-white [&>*]:my-5">
          <h1 className="text-[2rem] font-bold underline">Seznam hráčů pro termín 7.9:</h1>
          {firstTermPlayers?.length > 0 ? (
            firstTermPlayers?.map((player) => {
              return (
                <div
                  key={player.id}
                  className="flex items-center border border-white rounded-md p-4 [&>*]:mx-2">
                  <div>{player.name}</div>
                  <div>{player.rating}</div>
                  {admin && (
                    <>
                      <MdEdit
                        className="cursor-pointer hover:scale-110"
                        onClick={() => changeToEditMode(player)}
                      />
                      <MdDelete
                        className="cursor-pointer hover:scale-110"
                        onClick={() => deletePlayer(player.id)}
                      />
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <div>Zatím se nikdo nepřihlásil.</div>
          )}
          <h2 className="text-[1rem] italic">
            Počet volných míst: {32 - firstTermPlayers?.length}
          </h2>
        </div>
        <div className="flex flex-col justify-center items-center border border-white p-10 rounded-md shadow-lg shadow-white [&>*]:my-5">
          <h1 className="text-[2rem] font-bold underline">Seznam hráčů pro termín 14.9:</h1>
          {secondTermPlayers?.length > 0 ? (
            secondTermPlayers?.map((player) => {
              return (
                <div
                  key={player.id}
                  className="flex items-center border border-white rounded-md p-4 [&>*]:mx-2">
                  <div>{player.name}</div>
                  <div>{player.rating}</div>
                  {admin && (
                    <>
                      <MdEdit
                        className="cursor-pointer hover:scale-110"
                        onClick={() => changeToEditMode(player)}
                      />
                      <MdDelete
                        className="cursor-pointer hover:scale-110"
                        onClick={() => deletePlayer(player.id)}
                      />
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <div>Zatím se nikdo nepřihlásil.</div>
          )}
          <h2 className="text-[1rem] italic">
            Počet volných míst: {32 - secondTermPlayers?.length}
          </h2>
        </div>
        <div className="flex flex-col justify-center items-center border border-white p-10 rounded-md shadow-lg shadow-white [&>*]:my-5">
          <h1 className="text-[2rem] font-bold underline">Seznam hráčů pro termín 21.9:</h1>
          {thirdTermPlayers?.length > 0 ? (
            thirdTermPlayers?.map((player) => {
              return (
                <div
                  key={player.id}
                  className="flex items-center border border-white rounded-md p-4 [&>*]:mx-2">
                  <div>{player.name}</div>
                  <div>{player.rating}</div>
                  {admin && (
                    <>
                      <MdEdit
                        className="cursor-pointer hover:scale-110"
                        onClick={() => changeToEditMode(player)}
                      />
                      <MdDelete
                        className="cursor-pointer hover:scale-110"
                        onClick={() => deletePlayer(player.id)}
                      />
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <div>Zatím se nikdo nepřihlásil.</div>
          )}
          <h2 className="text-[1rem] italic">
            Počet volných míst: {32 - thirdTermPlayers?.length}
          </h2>
        </div>
        <div className="flex flex-col justify-center items-center border border-white p-10 rounded-md shadow-lg shadow-white [&>*]:my-5">
          <h1 className="text-[2rem] font-bold underline">Seznam hráčů pro termín 28.9:</h1>
          {fourthTermPlayers?.length > 0 ? (
            fourthTermPlayers?.map((player) => {
              return (
                <div
                  key={player.id}
                  className="flex items-center border border-white rounded-md p-4 [&>*]:mx-2">
                  <div>{player.name}</div>
                  <div>{player.rating}</div>
                  {admin && (
                    <>
                      <MdEdit
                        className="cursor-pointer hover:scale-110"
                        onClick={() => changeToEditMode(player)}
                      />
                      <MdDelete
                        className="cursor-pointer hover:scale-110"
                        onClick={() => deletePlayer(player.id)}
                      />
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <div>Zatím se nikdo nepřihlásil.</div>
          )}
          <h2 className="text-[1rem] italic">
            Počet volných míst: {32 - fourthTermPlayers?.length}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default App;
