// components/AddPlanetUI.tsx
import React from "react";

interface ActivePlanet {
  mass: number;
}

interface AddPlanetUIProps {
  mass: string;
  setMass: React.Dispatch<React.SetStateAction<string>>;
  onAddPlanet: () => void;
  onRemovePlanet: () => void;
  activePlanet: ActivePlanet | null;
  // Add new props for the button
  showRays: boolean;
  onToggleRays: () => void;
}

const AddPlanetUI: React.FC<AddPlanetUIProps> = ({
  mass,
  setMass,
  onAddPlanet,
  onRemovePlanet,
  activePlanet,
  showRays,
  onToggleRays,
}) => {
  return (
    <div
      className="rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg
                 border border-white/30 shadow-lg p-8 text-white w-80"
    >
      <h2 className="mb-6 text-2xl font-semibold text-center">
        Cosmic Control
      </h2>
      <div className="mb-6">
        <label
          htmlFor="mass"
          className="mb-3 block text-sm font-medium text-gray-300"
        >
          Planet Mass:{" "}
          <span className="font-bold text-white">
            {Number(mass).toFixed(1)}
          </span>
        </label>
        <input
          id="mass"
          type="range"
          min="1"
          max="10"
          step="0.1"
          value={mass}
          onChange={(e) => setMass(e.target.value)}
          className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <div className="flex justify-between gap-4">
        <button
          onClick={onAddPlanet}
          className="flex-1 rounded-md bg-indigo-500 py-2 px-4 text-sm font-semibold text-white
                     transition-colors hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {activePlanet ? "Update" : "Create Planet"}
        </button>
        {activePlanet && (
          <button
            onClick={onRemovePlanet}
            className="flex-1 rounded-md bg-red-400 py-2 px-4 text-sm font-semibold text-white
                       transition-colors hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Remove
          </button>
        )}
      </div>

      {/* This block adds the new button, which is only visible when a planet exists */}
      {activePlanet && (
        <div className="mt-6 border-t border-white/20 pt-6">
          <button
            onClick={onToggleRays}
            className="w-full rounded-md bg-cyan-500 py-2 px-4 text-sm font-semibold text-white
                       transition-colors hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {showRays ? "Hide Light Rays" : "Show Light Rays"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddPlanetUI;