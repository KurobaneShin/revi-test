import {
  ClientLoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { motion } from "framer-motion";
import { monstersSchema } from "./_index";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export const clientLoader = (args: ClientLoaderFunctionArgs) => {
  const url = new URL(args.request.url);
  const monsterId = url.searchParams.get("monsterId");
  const monsters = JSON.parse(sessionStorage.getItem("monsters") || "[]");
  const parsed = monstersSchema.parse(monsters);
  if (!monsterId) {
    throw new Response("Not found", {
      status: 404,
    });
  }

  const monster = parsed.find((m) => m.id === monsterId);

  if (!monster) {
    throw new Response("Not found", {
      status: 404,
    });
  }

  return { monster };
};

export default function Winner() {
  const { monster } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background py-12">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">🎉 Winner! 🎉</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <motion.img
              src={monster.image}
              alt={monster.name}
              className="w-40 h-40 rounded-full shadow-xl mb-6"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            />
            <h2 className="text-3xl font-semibold mb-2">{monster.name}</h2>
            <p className="text-lg text-muted-foreground">
              Congratulations on your victory!
            </p>
          </motion.div>
        </CardContent>
      </Card>

      <motion.div
        className="mt-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button onClick={() => navigate("/")}>
          Play Again
        </Button>
      </motion.div>
    </div>
  );
}
