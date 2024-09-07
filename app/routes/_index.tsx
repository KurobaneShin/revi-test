import type { MetaFunction } from "@remix-run/node";

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
import { useState } from "react";
import { ClientActionFunctionArgs, Form } from "@remix-run/react";

interface Monster {
  name: string;
  attack: number;
  defense: number;
  speed: number;
  hp: number;
  image: string;
}

export const action = () => ({});

export const clientAction = async (
  { request, serverAction }: ClientActionFunctionArgs,
) => {
  const requestBody = await request.clone().formData();
  console.log(requestBody.get("name"));
  return await serverAction();
};

export default function Index() {
  const [monsters, setMonsters] = useState<Monster[]>([
    {
      name: "Slime",
      attack: 10,
      defense: 5,
      speed: 3,
      hp: 50,
      image: "/placeholder.svg",
    },
    {
      name: "Goblin",
      attack: 15,
      defense: 8,
      speed: 7,
      hp: 80,
      image: "/placeholder.svg",
    },
    {
      name: "Ogre",
      attack: 20,
      defense: 12,
      speed: 4,
      hp: 120,
      image: "/placeholder.svg",
    },
  ]);

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="grid gap-8">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Create Monster</h1>
          <Form method="post" className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Enter monster name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attack">Attack</Label>
              <Input
                id="attack"
                type="number"
                placeholder="Enter attack value"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defense">Defense</Label>
              <Input
                id="defense"
                type="number"
                placeholder="Enter defense value"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="speed">Speed</Label>
              <Input id="speed" type="number" placeholder="Enter speed value" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hp">HP</Label>
              <Input id="hp" type="number" placeholder="Enter HP value" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" placeholder="Enter image URL" />
            </div>
            <div className="mt-6 flex">
              <Button type="submit">Save Monster</Button>
            </div>
          </Form>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Created Monsters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monsters.map(({ name, attack, defense, speed, hp, image }) => (
              <Card key={name}>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
