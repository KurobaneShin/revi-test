import type { MetaFunction } from "@remix-run/node";
import { v4 as uuidv4 } from "uuid";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  ClientActionFunctionArgs,
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { useForm } from "@conform-to/react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Trash } from "lucide-react";

const monsterSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  attack: z.number().min(1),
  defense: z.number().min(1),
  speed: z.number().min(1),
  hp: z.number().min(1),
  image: z.string().min(1),
});

export const monstersSchema = z.array(monsterSchema);

export const clientLoader = () => {
  const monsters = JSON.parse(sessionStorage.getItem("monsters") || "[]");
  const parsed = monstersSchema.parse(monsters);
  return { monsters: parsed };
};

const deleteMonster = async (args: ClientActionFunctionArgs) => {
  const { request } = args;
  const formData = await request.clone().formData();
  const id = formData.get("id");
  if (!id) return {};
  const monsters = monstersSchema.parse(
    JSON.parse(sessionStorage.getItem("monsters") || "[]"),
  );
  monsters.splice(monsters.findIndex((m) => m.id === id), 1);
  sessionStorage.setItem("monsters", JSON.stringify(monsters));
  return {};
};

const createMonster = async (args: ClientActionFunctionArgs) => {
  const { request } = args;

  const formData = await request.clone().formData();
  const submission = parseWithZod(formData, { schema: monsterSchema });

  if (submission.status !== "success") {
    return (submission.reply());
  }
  const monsters = JSON.parse(sessionStorage.getItem("monsters") || "[]");
  monsters.push(submission.value);
  sessionStorage.setItem("monsters", JSON.stringify(monsters));

  return {};
};

export const clientAction = async (
  args: ClientActionFunctionArgs,
) => {
  const { request } = args;
  if (request.method === "DELETE") {
    return await deleteMonster(args);
  }
  return await createMonster(args);
};

export default function Index() {
  const { monsters } = useLoaderData<typeof clientLoader>();
  const lastResult = useActionData<typeof clientAction>();
  const [selectedMonsters, setSelectedMonsters] = useState<string[]>([]);
  const navigate = useNavigate();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: monsterSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const selectMonstersToFight = (monsterId: string) => {
    if (selectedMonsters.includes(monsterId)) {
      setSelectedMonsters(selectedMonsters.filter((m) => m !== monsterId));
      return;
    }
    if (selectedMonsters.length === 2) {
      alert("You can only select 2 monsters to fight");
      return;
    }
    setSelectedMonsters([...selectedMonsters, monsterId]);
  };

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="grid gap-8">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Create Monster</h1>
          <Form
            method="post"
            id={form.id}
            onSubmit={form.onSubmit}
            noValidate
            className="grid grid-cols-2 gap-4"
          >
            <input type="hidden" name="id" value={uuidv4()} />
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                key={fields.name.key}
                name={fields.name.name}
                defaultValue={fields.name.initialValue}
                placeholder="Enter monster name"
              />
              <span className="text-red-500">{fields.name.errors}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="attack">Attack</Label>
              <Input
                key={fields.attack.key}
                name={fields.attack.name}
                defaultValue={fields.attack.initialValue}
                id="attack"
                type="number"
                placeholder="Enter attack value"
              />
              <span className="text-red-500">{fields.attack.errors}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defense">Defense</Label>
              <Input
                key={fields.defense.key}
                name={fields.defense.name}
                defaultValue={fields.defense.initialValue}
                id="defense"
                type="number"
                placeholder="Enter defense value"
              />
              <span className="text-red-500">{fields.defense.errors}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="speed">Speed</Label>
              <Input
                key={fields.speed.key}
                name={fields.speed.name}
                defaultValue={fields.speed.initialValue}
                id="speed"
                type="number"
                placeholder="Enter speed value"
              />
              <span className="text-red-500">{fields.speed.errors}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hp">HP</Label>
              <Input
                key={fields.hp.key}
                name={fields.hp.name}
                defaultValue={fields.hp.initialValue}
                id="hp"
                type="number"
                placeholder="Enter HP value"
              />
              <span className="text-red-500">{fields.hp.errors}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                key={fields.image.key}
                name={fields.image.name}
                defaultValue={fields.image.initialValue}
                id="image"
                placeholder="Enter image URL"
              />
              <span className="text-red-500">{fields.image.errors}</span>
            </div>
            <div className="mt-6 flex">
              <Button type="submit">Save Monster</Button>
            </div>
          </Form>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold mb-4">Created Monsters</h2>
            <Button
              type="button"
              disabled={selectedMonsters.length !== 2}
              onClick={() =>
                navigate(`/fight?monsters${
                  selectedMonsters.length > 0
                    ? `=${selectedMonsters.join(",")}`
                    : ""
                }`)}
            >
              Fight
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monsters.map(({ name, attack, defense, speed, hp, image, id }) => (
              <Card key={id} className="space-y-2">
                <Card
                  className={cn(
                    "cursor-pointer",
                    `${selectedMonsters.includes(id) ? "bg-blue-500" : ""}`,
                  )}
                  key={name}
                  onClick={() =>
                    selectMonstersToFight(id)}
                >
                  <img
                    src={image}
                    width={200}
                    height={200}
                    alt="Monster"
                    className="rounded-t-lg object-cover w-full aspect-square"
                  />
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold">{name}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <span className="font-medium">Attack:</span> {attack}
                      </div>
                      <div>
                        <span className="font-medium">Defense:</span> {defense}
                      </div>
                      <div>
                        <span className="font-medium">Speed:</span> {speed}
                      </div>
                      <div>
                        <span className="font-medium">HP:</span> {hp}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Form method="delete">
                  <input type="hidden" name="id" value={id} />
                  <button type="submit">
                    <Trash className="text-red-500 hover:text-red-700" />
                  </button>
                </Form>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
