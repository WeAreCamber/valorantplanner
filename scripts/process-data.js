
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAPS_SOURCE = path.join(__dirname, '../src/data/maps-source.json');
const AGENTS_SOURCE = path.join(__dirname, '../src/data/agents-source.json');
const MAPS_DEST = path.join(__dirname, '../src/data/maps.json');
const AGENTS_DEST = path.join(__dirname, '../src/data/agents.json');

const TARGET_MAPS = [
  'Pearl', 'Ascent', 'Bind', 'Haven', 'Split', 
  'Fracture', 'Lotus', 'Sunset', 'Abyss', 'Icebox'
];

try {
  // Process Maps
  const mapsRaw = JSON.parse(fs.readFileSync(MAPS_SOURCE, 'utf8'));
  const maps = mapsRaw.data
    .filter(map => TARGET_MAPS.includes(map.displayName))
    .map(map => ({
      uuid: map.uuid,
      displayName: map.displayName,
      splash: map.splash,
      displayIcon: map.displayIcon, // Top-down view
      listViewIcon: map.listViewIcon,
      coordinates: map.coordinates,
    }));

  fs.writeFileSync(MAPS_DEST, JSON.stringify(maps, null, 2));
  console.log(`Processed ${maps.length} maps.`);

  // Process Agents
  const agentsRaw = JSON.parse(fs.readFileSync(AGENTS_SOURCE, 'utf8'));
  const agents = agentsRaw.data
    .filter(agent => agent.isPlayableCharacter)
    .map(agent => ({
      uuid: agent.uuid,
      displayName: agent.displayName,
      displayIcon: agent.displayIcon,
      fullPortrait: agent.fullPortrait,
      role: agent.role ? {
        displayName: agent.role.displayName,
        displayIcon: agent.role.displayIcon
      } : null,
      description: agent.description
    }));

  fs.writeFileSync(AGENTS_DEST, JSON.stringify(agents, null, 2));
  console.log(`Processed ${agents.length} agents.`);

} catch (error) {
  console.error('Error processing data:', error);
}
