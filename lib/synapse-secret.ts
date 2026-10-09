import "server-only";
import { generatePuzzle } from "./synapse";
// Kept exclusively in the server bundle. The client receives clues and feedback, never the answer.
const SEED = "penn-neural-code-64d74f08-c105-4df0-82e8-948f27cd2b86-v2";
export function dailySecret(day: string) { return generatePuzzle(day, SEED); }
