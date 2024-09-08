export const HPBar = (
  { currentHP, maxHP }: { currentHP: number; maxHP: number },
) => {
  // Calculate the percentage of HP remaining
  const hpPercentage = (currentHP / maxHP) * 100;

  return (
    <div className="w-full bg-gray-300 rounded-lg h-6">
      <div
        className={`bg-red-500 h-6 rounded-lg transition-all duration-300`}
        style={{ width: `${hpPercentage}%` }}
      >
      </div>
    </div>
  );
};
