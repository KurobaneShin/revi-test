import {
  ClientLoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { motion } from "framer-motion";
import { monstersSchema } from "./_index";
import { useEffect, useState } from "react";
import { HPBar } from "~/components/HPBar";
import { Button } from "~/components/ui/button";

export const clientLoader = (args: ClientLoaderFunctionArgs) => {
  const url = new URL(args.request.url);
  const monstersIds = url.searchParams.get("monsters")?.split(",");

  const monsters = JSON.parse(sessionStorage.getItem("monsters") || "[]");

  const parsed = monstersSchema.parse(monsters);

  if (!monstersIds) {
    throw new Response("Not found", {
      status: 404,
    });
  }

  const monstersToFight = monstersIds.map((id) =>
    parsed.find((m) => m.id === id)
  ) as typeof parsed;

  if (!monsters) {
    throw new Response("Not found", {
      status: 404,
    });
  }

  if (!monstersToFight || monstersToFight.length !== 2) {
    throw new Response("Not found", {
      status: 404,
    });
  }

  return { monstersToFight };
};
export default function Fight() {
  const { monstersToFight } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const [monster1, setMonster1] = useState({
    ...monstersToFight[0],
    currentHP: monstersToFight[0].hp,
  });

  const [monster2, setMonster2] = useState(
    {
      ...monstersToFight[1],
      currentHP: monstersToFight[1].hp,
    },
  );

  const defineFirstAttacker = () => {
    //monster with more speed and if equal, more attack
    if (monster1.speed > monster2.speed) {
      return monster1.id;
    } else if (monster1.speed < monster2.speed) {
      return monster2.id;
    } else if (monster1.attack > monster2.attack) {
      return monster1.id;
    } else if (monster1.attack < monster2.attack) {
      return monster2.id;
    }
  };

  const [attackerRound, setAttackerRound] = useState(
    defineFirstAttacker(),
  );

  const [rounds, setRounds] = useState(1);

  const damage = (attckerNum: number, defenderNum: number) => {
    return attckerNum - defenderNum;
  };
  const fight = () => {
    if (monster1.currentHP <= 0 || monster2.currentHP <= 0) {
      return;
    }

    if (attackerRound === monster1.id) {
      setMonster2((prevState) => ({
        ...prevState,
        currentHP: prevState.currentHP -
          damage(monster1.attack, monster2.defense),
      }));

      setRounds(rounds + 1);
      setAttackerRound(monster2.id);
      return;
    }

    setMonster1((prevState) => ({
      ...prevState,
      currentHP: prevState.currentHP -
        damage(monster2.attack, monster1.defense),
    }));

    setRounds(rounds + 1);
    setAttackerRound(monster1.id);
  };

  useEffect(() => {
    if (monster1.currentHP <= 0) {
      navigate(`/winner?monsterId=${monster2.id}`);
      setTimeout(() => {
        navigate(`/winner?monsterId=${monster2.id}`);
      }, 600);
      return;
    }
    if (monster2.currentHP <= 0) {
      setTimeout(() => {
        navigate(`/winner?monsterId=${monster1.id}`);
      }, 600);
      return;
    }
  }, [
    monster1.currentHP,
    monster2.currentHP,
    navigate,
    monster1.id,
    monster2.id,
  ]);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Monster Fight</h1>

      <div className="text-center text-lg mb-6">
        Round: <span className="font-bold">{rounds}</span>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold">Attacker</h2>
        <h2 className="text-2xl font-bold text-red-600">
          {attackerRound === monster1.id ? monster1.name : monster2.name}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="text-center">
          <HPBar currentHP={monster1.currentHP} maxHP={monster1.hp} />
          <h2 className="text-2xl font-bold mt-4 mb-2">{monster1.name}</h2>
          <motion.img
            src={monster1.image}
            alt={monster1.name}
            animate={rounds !== 1 && attackerRound === monster2.id
              ? { x: [0, 100, 0] }
              : {}}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full max-w-xs mx-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="text-center">
          <HPBar currentHP={monster2.currentHP} maxHP={monster2.hp} />
          <h2 className="text-2xl font-bold mt-4 mb-2">{monster2.name}</h2>
          <motion.img
            src={monster2.image}
            alt={monster2.name}
            animate={rounds !== 1 && attackerRound === monster1.id
              ? { x: [0, -100, 0] }
              : {}}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full max-w-xs mx-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="text-center mt-10">
        <Button
          onClick={fight}
          className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600"
        >
          Fight
        </Button>
      </div>
    </div>
  );
}
